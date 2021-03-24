import React, { useEffect, useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";

import classnames from "classnames";

const gf = new GiphyFetch("e3XijBRN98RxgdFW36l7h4ODJsU57geL");

function App() {
  const [search, setSearch] = useState("");
  const [favourited, setFavourited] = useState([]);
  const [input, setInput] = useState("");
  const [stateImages, setStateImages] = useState([]);

  let [number, setNumber] = useState(8);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.charCode === 13) {
      console.log(e.target.value);
      setSearch(input);
      setInput("");
    }
  };

  const handleClickSearch = () => {
    if (!input.trim().length) {
      setInput("");
    } else {
      setSearch(input);
      setInput("");
    }
  };

  const handleClickFavourited = () => {
    setStateImages(favourited);
  };

  const handleNextListImage = () => {
    setNumber((number += 8));
  };

  const handleFavourited = (id, url) => {
    if (!favourited.length) {
      setFavourited([...favourited, { id, url }]);
    } else {
      const filterId = favourited.filter((item, index) => item.id === id);
      if (filterId.length) {
        for (let i = 0; i < favourited.length; i++) {
          if (favourited[i].id === id) {
            setFavourited([
              ...favourited.slice(0, i),
              ...favourited.slice(i + 1)
            ]);
          }
        }
      } else {
        setFavourited([...favourited, { id, url }]);
      }
    }
  };

  useEffect(() => {
    const callApiImage = async () => {
      const { data } = await gf.search(search, { limit: number });
      setStateImages(data);
    };
    callApiImage();
  }, [search, number]);

  return (
    <div className="App">
      <div className="wrapper">
        <header className="header">
          <ul className="menu-header">
            <li>
              Galler<b>easy</b>
            </li>
            <li onClick={() => handleClickSearch()}>
              <b>Search</b>
            </li>
            <li onClick={() => handleClickFavourited()}>
              Favourites({favourited.length})
            </li>
          </ul>
        </header>
        <section className="content">
          <input
            type="text"
            placeholder="Started searching for images"
            onKeyPress={handleSearch}
            onChange={handleChange}
            value={input}
          />
          <div className="content__list">
            {stateImages.length ? (
              stateImages.slice(-8).map((item, index) => (
                <div className="content__list-img">
                  {item.images === undefined ? (
                    <>
                      <img src={item.url} alt="" />
                      <i
                        className={classnames("fas", "fa-heart", "heart-img", {
                          "heart-active": favourited.filter(
                            (value) => value.id === item.id
                          ).length
                        })}
                        onClick={() => handleFavourited(item.id, item.url)}
                      ></i>
                    </>
                  ) : (
                    <>
                      <img src={item.images.downsized.url} alt="" />
                      <i
                        className={classnames("fas", "fa-heart", "heart-img", {
                          "heart-active": favourited.filter(
                            (value) => value.id === item.id
                          ).length
                        })}
                        onClick={() =>
                          handleFavourited(item.id, item.images.downsized.url)
                        }
                      ></i>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div>Not found !</div>
            )}
          </div>
        </section>
        <div className="btn-fetch">
          <button onClick={() => handleNextListImage()}>Fetch More</button>
        </div>
        <footer>
          <ul className="menu-footer">
            <li>Gallereasy POC web app</li>
            <li>2359 Media</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default App;
