import "./style.css";
import getFanFictionNetStoryData from "./fanfiction_two";
import getArchiveOfOurOwnData from "./archiveofourown";

// FanFiction.net

// const fanfictionnetFavoritesURL = "https://www.fanfiction.net/favorites/story.php";
const fanfictionnetFavoritesURLMobile =
  "https://m.fanfiction.net/m/f_story.php";

// const fanfictionnetFollowingURL = "https://www.fanfiction.net/alert/story.php";
const fanfictionnetFollowingURLMobile =
  "https://m.fanfiction.net/m/a_story.php";

// Archive of Our Own

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>FicFavorites</h1>
  <p>Click on a site to load it's data</p>
  <ul>
    <li id="ffnet">
      <p>FanFiction.net</p>
      <small>Favorites & Following</small>
    </li>
    <li id="ao3">
      <p>Archive of Our Own</p>
      <small>Authors, Series & Works</small>  
    </li>
  </ul>
`;

document
  .querySelector<HTMLLIElement>("#ffnet")!
  .addEventListener("click", () => {
    getFanFictionNetStoryData(fanfictionnetFavoritesURLMobile).then(
      console.log
    );
    getFanFictionNetStoryData(fanfictionnetFollowingURLMobile).then(
      console.log
    );
  });

document.querySelector<HTMLLIElement>("#ao3")!.addEventListener("click", () => {
  // TODO: Use an actual ao3 account here
  getArchiveOfOurOwnData("testtest").then(console.log);
});
