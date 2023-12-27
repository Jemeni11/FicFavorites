async function getArchiveOfOurOwnData(username: string) {
  let ao3SubscriptionURL = `https://archiveofourown.org/users/${username}/subscriptions`;
  const authors = [];
  const works = [];
  const series = [];
  let numberOfPages = 1;
  let i = 1;

  do {
    try {
      if (i > 1) {
        ao3SubscriptionURL = ao3SubscriptionURL + `?page=${i}`;
      }
      const response = await fetch(ao3SubscriptionURL, {
        mode: "cors",
        credentials: "include",
      });
      const htmlText = await response.text();

      const parser = new DOMParser();
      const document = parser.parseFromString(htmlText, "text/html");

      const main: HTMLDivElement = document.querySelector("div#main")!;
      const dataLinkTable: HTMLDListElement = main.querySelector(
        "dl.subscription.index.group"
      )!;
      const links = Array.from(
        dataLinkTable.querySelectorAll("dt")!,
        (link) => {
          const children = link.children;
          return Array.from(children) as HTMLAnchorElement[];
        }
      );

      for (let linkArray of links) {
        // if linkArray has one child
        // Does that child have the text "Anonymous"?
        //  Yes, then it's a work and Anonymous is the author
        //  No, then it's an author
        // if linkArray has two or more children
        // Check if it has the text "Series"
        //  Yes, then it's a series
        //  No, then it's a work
        const linkArrayLength = linkArray.length;
        if (linkArrayLength === 1) {
          const link = linkArray[0];
          const linkTextContent = link
            .textContent!.replace(/\n\s+/g, " ")
            .trim();
          if (linkTextContent.includes("Anonymous")) {
            const isSeries = link.pathname.includes("/series/");

            const workLink = "https://archiveofourown.org" + link.pathname;
            const workTitle = link.textContent!.trim();

            const workObject = {
              id: workLink,
              title: workTitle,
              link: workLink,
              authorName: ["Anonymous"],
              authorLink: ["https://archiveofourown.org/collections/anonymous"],
            };

            if (isSeries) {
              series.push(workObject);
            } else {
              works.push(workObject);
            }
          } else {
            authors.push({
              name: link.textContent,
              link: "https://archiveofourown.org" + link.pathname,
            });
          }
        } else if (linkArrayLength >= 2) {
          const workAnchorTag = linkArray[0];
          const authorsAnchorTag = linkArray.slice(1);

          const workTitle = workAnchorTag.textContent!.trim();

          const isSeries = workAnchorTag.pathname.includes("/series/");

          const authorNames = authorsAnchorTag.map((author) =>
            author.textContent!.trim()
          );

          const authorLinks = authorsAnchorTag.map(
            (author) => "https://archiveofourown.org" + author.pathname
          );

          const workLink =
            "https://archiveofourown.org" + workAnchorTag.pathname;

          const workObject = {
            id: workLink,
            title: workTitle,
            link: workLink,
            authorName: authorNames,
            authorLink: authorLinks,
          };

          if (isSeries) {
            series.push(workObject);
          } else {
            works.push(workObject);
          }
        }
      }

      // Check if the subscriptions are on one page or more
      const nav: HTMLOListElement | null = main.querySelector(
        "ol[role='navigation']"
      );

      if (nav) {
        const navChildren = Array.from(
          nav.children,
          (listItem) => listItem.textContent!
        );
        numberOfPages = +navChildren[navChildren.length - 2];
      }
    } catch (error) {
      console.error(error);
    }
    i++;
  } while (i <= numberOfPages);

  return { authors, works, series };
}

export default getArchiveOfOurOwnData;
