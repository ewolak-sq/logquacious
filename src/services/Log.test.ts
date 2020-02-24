import { QueryManipulator, showContextButton } from "./Log"
import { Query } from "./Query"

function parseHTML(html: string): HTMLDivElement {
  const el = document.createElement('div')
  el.innerHTML = html
  return el
}

function getLink(html: string): string {
  const el = parseHTML(html)
  return el.querySelector("a").href
}

describe('log', () => {
  describe('showContextButton', () => {
    let qm: QueryManipulator

    beforeEach(() => {
      qm = {
        getQuery: () => {
          return new Query()
        },
        // tslint:disable-next-line:no-empty
        changeQuery: () => {
        },
        getFilters: () => {
          return []
        },
      }
    })

    test('not found', () => {
      const html = showContextButton(
        {title: "", keep: ["with.dots"]},
        {
          "a": "a",
          "z": "z",
        },
        undefined,
        qm,
      )
      expect(html).toBeUndefined()
    })

    test('nested array with regexp', () => {
      const html = showContextButton(
        {title: "", keep: ["with.dots"]},
        {
          "a": "a",
          "nested": [
            {"with.dots": "!"},
          ],
          "z": "z",
        },
        undefined,
        qm,
      )
      expect(getLink(html)).toContain('q=nested.with.dots:%22!%22')
    })

    test('nested object with regexp', () => {
      const html = showContextButton(
        {title: "", keep: ["with.dots"]},
        {
          "a": "a",
          "nested": {"with.dots": "!"},
          "z": "z",
        },
        undefined,
        qm,
      )
      expect(getLink(html)).toContain('q=nested.with.dots:%22!%22')
    })

    test('remove non-context query', () => {
      const q = new Query()
        .withAddTerms("service:zoot")
        .withAddTerms("otherfilter:true")
      qm.getQuery = () => q

      const html = showContextButton(
        {title: "", keep: ["service"]},
        {
          "a": "a",
          "service": "zoot",
        },
        undefined,
        qm,
      )
      expect(getLink(html)).toContain('service:%22zoot%22')
      expect(getLink(html)).not.toContain('otherfilter')
    })
  })
})