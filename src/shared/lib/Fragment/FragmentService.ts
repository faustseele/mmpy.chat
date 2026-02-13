import Handlebars from "handlebars";
import { BaseConfigs } from "../Component/model/base.types.ts";
import { ChildGraph } from "../Component/model/children.types.ts";

/**
 * @FragmentService – stateless feature-service.
 * * compiles markup with Handlebars
 * * inserts children into the parent DocumentFragment (Element)
 * * * before attaching them to the DOM
 * @sourceMarkup – raw HTML-string
 * e.g., sourceMarkup provided by Component
 * @compiledSourceMarkup – Handlebars-compiled HTML-string with stubs
 * @returns DocumentFragment
 * DocumentFragment is an off-DOM lightweight container.
 * when appended to a DOM Element, its child nodes-
 * are moved out of the DocumentFragment into the target Element.
 */
export default class FragmentService<C extends BaseConfigs> {
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();

  public compile(sourceMarkup: string, configs: C): DocumentFragment {
    let template = this.templateCache.get(sourceMarkup);

    /* compile if not cached */
    if (!template) {
      template = Handlebars.compile(sourceMarkup);
      this.templateCache.set(sourceMarkup, template);
    }

    const compiledSourceMarkup = template(configs);
    return this._createFragmentFromString(compiledSourceMarkup);
  }

  public compileWithChildren(
    sourceMarkup: string,
    configs: C,
    children: ChildGraph,
  ): DocumentFragment {
    let template = this.templateCache.get(sourceMarkup);

    /* creates <li id="random UUID"></li>.. stubs for children */
    const divStubs = this._createStubs(children);

    /* compile if not cached */
    if (!template) {
      template = Handlebars.compile(sourceMarkup);
      this.templateCache.set(sourceMarkup, template);
    }

    /**
     * handles {{expressions-configs}} & {{{children-html expressions}}}
     * inserts stubs into the (cached) template
     */
    const compiledSourceMarkupWithStubs = template({
      /* {{{children-html expressions}}} */
      ...divStubs,
      /* {{config-expressions}} of a parent */
      ...configs,
    });

    /* creates a DocumentFragment <li> children stubs */
    const fragmentWithStubs = this._createFragmentFromString(
      compiledSourceMarkupWithStubs,
    );

    /* swappes <li> children stubs with corresponding Elements*/
    const fragmentWithElements = this._replaceStubsInFragment(
      fragmentWithStubs,
      children,
    );

    return fragmentWithElements;
  }

  /**
   * generates an obj with either one li-stub '<tag></tag>' by key
   * or a concatenated list of li-stubs <tags> by key.
   */
  private _createStubs(graph: ChildGraph): Record<string, string> {
    const divStubs: Record<string, string> = {};

    Object.keys(graph.edges).forEach((edge) => {
      if (Array.isArray(graph.edges[edge])) {
        /* sets stub for each child -> stubsList[] */
        const stubsList = graph.edges[edge].map(
          (id) => `<li data-id="${id}"></li>`,
        );
        /* concatenates stubsList[] into one string */
        divStubs[edge] = stubsList.join("");
      } else {
        divStubs[edge] = `<li data-id="${edge}"></li>`;
      }
    });

    return divStubs;
  }

  /**
   * Creates a DocumentFragment from a raw HTML string.
   */
  private _createFragmentFromString(htmlString: string): DocumentFragment {
    return document.createRange().createContextualFragment(htmlString);
  }

  /**
   * iterates through the fragment and replaces all stub <li>'s
   * with their corresponding, real component elements.
   */
  private _replaceStubsInFragment(
    fragment: DocumentFragment,
    graph: ChildGraph,
  ): DocumentFragment {
    /* finds all stubs in one pass */
    const stubs = fragment.querySelectorAll("li[data-id]");
    const stubsMap = new Map<string, Element>();

    stubs.forEach((stub) => {
      stubsMap.set(stub.getAttribute("data-id") || "", stub);
    });

    /* iterates children and swaps using the Map */
    Object.values(graph.nodes).forEach((node) => {
      const id = node.params.configs.id;
      const stub = stubsMap.get(id);
      const childElement = node.runtime?.instance.element;

      if (stub && childElement) {
        stub.replaceWith(childElement);
      }
    });
    return fragment;
  }
}
