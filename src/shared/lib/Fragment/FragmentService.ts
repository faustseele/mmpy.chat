import Handlebars from "handlebars";
import { BaseConfigs, BaseProps } from "../Component/model/base.types.ts";
import { ChildGraph } from "../Component/model/children.types.ts";
import { ComponentNode } from "../Component/model/types.ts";

/**
 * @FragmentService – stateless feature-service.
 * * compiles markup with Handlebars
 * * inserts children into the parent DocumentFragment (Element)
 * * * before attaching them to the DOM
 * @sourceMarkup – raw HTML-string
 * e.g., sourceMarkup provided by Component
 * @compiledSourceMarkup – Handlebars-compiled HTML-string with placeholders
 * @returns DocumentFragment
 * DocumentFragment is an off-DOM lightweight container.
 * when appended to a DOM Element, its child nodes-
 * are moved out of the DocumentFragment into the target Element.
 */
export default class FragmentService<C extends BaseConfigs> {
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();
  private _template = document.createElement("template");

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

    /* creates <li id="random UUID"></li>.. placeholders for children */
    const divPlaceholders = this._createDivPlaceholders(children);

    /* compile if not cached */
    if (!template) {
      template = Handlebars.compile(sourceMarkup);
      this.templateCache.set(sourceMarkup, template);
    }

    /**
     * handles {{expressions-configs}} & {{{children-html expressions}}}
     * inserts placeholders into the (cached) template
     */
    const compiledSourceMarkupWithPlaceholders = template({
      /* {{{children-html expressions}}} */
      ...divPlaceholders,
      /* {{config-expressions}} of a parent */
      ...configs,
    });

    /* creates a DocumentFragment <li> children placeholders */
    const fragmentWithPlaceholders = this._createFragmentFromString(
      compiledSourceMarkupWithPlaceholders,
    );

    /* swappes <li> children placeholders with corresponding Elements*/
    const fragmentWithElements = this._replacePlaceholdersInFragment(
      fragmentWithPlaceholders,
      children,
    );

    return fragmentWithElements;
  }

  /**
   * generates an obj with either one li-placeholder '<tag></tag>' by key
   * or a concatenated list of li-placeholders <tags> by key.
   */
  private _createDivPlaceholders(graph: ChildGraph): Record<string, string> {
    const divPlaceholders: Record<string, string> = {};

    Object.keys(graph.edges).forEach((edge) => {
      if (Array.isArray(graph.edges[edge])) {
        /* sets placeholder for each child -> placeholdersList[] */
        const placeholdersList = graph.edges[edge].map(
          (id) => `<li data-id="${id}"></li>`,
        );
        /* concatenates placeholdersList[] into one string */
        divPlaceholders[edge] = placeholdersList.join("");
      } else {
        divPlaceholders[edge] = `<li data-id="${edge}"></li>`;
      }
    });

    return divPlaceholders;
  }

  /**
   * Creates a DocumentFragment from a raw HTML string.
   */
  private _createFragmentFromString(htmlString: string): DocumentFragment {
    /* sets the HTML of the inert template */
    this._template.innerHTML = htmlString;

    /* a deep clone of the template's content (DocumentFragment) */
    return this._template.content.cloneNode(true) as DocumentFragment;
  }

  /**
   * iterates through the fragment and replaces all placeholder divs
   * with their corresponding, real component elements.
   */
  private _replacePlaceholdersInFragment(
    fragment: DocumentFragment,
    graph: ChildGraph,
  ): DocumentFragment {
    Object.keys(graph.edges).forEach((edge) => {
      if (Array.isArray(graph.edges[edge])) {
        graph.edges[edge].forEach((nodeId) => {
          findAndReplace(graph.nodes[nodeId]);
        });
      } else {
        findAndReplace(graph.nodes[edge]);
      }
    });

    function findAndReplace(node: ComponentNode<BaseProps>) {
      if (!node?.runtime?.instance) {
        console.error("Child has no instance", node);
        return;
      }

      const placeholder = fragment.querySelector(
        `[data-id="${node.params.configs.id}"]`,
      );
      const childElement = node.runtime?.instance.element;

      if (placeholder && childElement) {
        placeholder.replaceWith(childElement);
      } else {
        /* console.error(
            `FragmentService Error: Could not replace child placeholder.
          Child ID: ${node.params.configs.id}.
          Placeholder found: ${!!placeholder}.
          Child element obtained: ${!!childElement}.
          DocumentFragment content:`,
            JSON.stringify(fragment),
          ); */
      }
    }

    return fragment;
  }
}
