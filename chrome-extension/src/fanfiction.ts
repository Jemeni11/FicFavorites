type actualDataType = {
  storyData: [storyLink: string, storyTitle: string];
  authorData: [authorLink: string, authorName: string];
  dateCreated: string;
  dateUpdated: string;
};

type getStoryDataReturnType = {
  authorLink: string;
  authorName: string;
  storyLink: string;
  storyTitle: string;
  dateCreated: string;
  dateUpdated: string;
};

function getStoryData(arr: actualDataType) {
  const authorLink = arr.authorData[0];
  const authorName = arr.authorData[1];
  const storyLink = arr.storyData[0];
  const storyTitle = arr.storyData[1];
  const dateCreated = arr.dateCreated.substring(2);
  const dateUpdated = arr.dateUpdated.substring(1);
  return {
    authorLink,
    authorName,
    storyLink,
    storyTitle,
    dateCreated,
    dateUpdated,
  };
}

async function getFanFictionNetStoryData(url: string) {
  const res = await fetch(url);
  const resText = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(resText, "text/html");
  const tableRows = Array.from(
    doc.querySelectorAll("table tbody")[0].children,
    (tableRow) => tableRow.children
  );
  tableRows.pop(); // Removes the "Remove Selected" button
  tableRows.shift(); // Removes the header row
  const storyData = tableRows.map((row) => row[0].children);
  const storyDataList = storyData.map((htmlColl) => {
    let newArr = Array.from(htmlColl);
    let newArrHTML: HTMLElement[] = newArr as HTMLElement[];
    newArrHTML.splice(2, 1);
    newArrHTML.splice(3, 1);
    return newArrHTML;
  });
  const actualData = storyDataList.map((htmlItem) =>
    htmlItem.map((htmlItemChild) => {
      if (htmlItemChild.tagName === "A") {
        let htmlItemChildA = htmlItemChild as HTMLAnchorElement;
        return [htmlItemChildA.pathname, htmlItemChildA.textContent];
      }
      return htmlItemChild.textContent;
    })
  );

  const listOfStories: getStoryDataReturnType[] = actualData.map((arr) => {
    const actualDataADT: actualDataType = arr! as unknown as actualDataType;
    return getStoryData(actualDataADT);
  });

  return listOfStories;
}

export default getFanFictionNetStoryData;
