import React, { useEffect, useState } from "react";

import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

import classnames from "classnames";

const gf = new GiphyFetch("e3XijBRN98RxgdFW36l7h4ODJsU57geL");

const fetchGifs = (offset: number) => gf.search({ offset, limit: 8 });

function App() {
  const [search, setSearch] = useState("");
  const [listImages, setListImages] = useState([]);
  const [favourited, setFavourited] = useState([]);
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.charCode === 13) {
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
    setListImages(favourited);
  };

  const handleFavourited = (id, url, isClick) => {
    if (!favourited.length) {
      setFavourited([...favourited, { id, url, isClick: isClick }]);
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
        setFavourited([...favourited, { id, url, isClick: isClick }]);
      }
    }
  };

  useEffect(() => {
    const callApiImage = async () => {
      const { data } = await gf.search(search, { limit: 8 });
      setListImages(data);
    };
    callApiImage();
  }, [search]);

  return (
    <div className="App">
      <div className="wrapper">
        <header className="header">
          <ul className="menu-header">
            <li>Gallereasy</li>
            <li onClick={() => handleClickSearch()}>Search</li>
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
            {listImages.length ? (
              listImages.map((item, index) => (
                <div className="content__list-img">
                  <img src={item.images.downsized.url} alt="" />
                  <i
                    className={classnames("fas", "fa-heart", "heart-img", {
                      "heart-active": favourited.filter(
                        (value) => value.id === item.id
                      ).length
                    })}
                    onClick={() =>
                      handleFavourited(item.id, item.images.downsized.url, true)
                    }
                  ></i>
                </div>
              ))
            ) : (
              <div>Not found !</div>
            )}
          </div>
        </section>
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
