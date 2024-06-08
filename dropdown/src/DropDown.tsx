
import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import s from './dropDown.module.css';

export function DropDown() {
  const [isDropdownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [allCoins, setAllCoins] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [choiceFlag, setChoiceFlag] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);

  const itemHeight = 40;
  const windowHeight = 306;
  const overscan = 20;

  const options = {
    shouldSort: true,
    threshold: 0.1,
    keys: [],
  };

  const fuse = new Fuse(allCoins, options);
  const fuseFavorites = new Fuse(favorites, options);

  const filteredCoins = fuse.search(searchText).map(({ item }) => item);
  const filteredFavorites = fuseFavorites.search(searchText).map(({ item }) => item);

  const totalItems = !choiceFlag
    ? (!searchText.length ? allCoins.length : filteredCoins.length)
    : (!searchText.length ? favorites.length : filteredFavorites.length);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(startIndex + Math.ceil(windowHeight / itemHeight) + 2 * overscan, totalItems);

  const generateRows = (list: string[]) => {
    const rows: JSX.Element[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      if (i < 0 || i >= list.length) continue;
      rows.push(
        <button
          style={{ height: `${itemHeight}px`, top: `${itemHeight * i}px`, position: 'absolute'}}
          onClick={() => handleFavorites(list[i])}
          className={s.coinBtn}
          key={list[i]}
        >
          {favorites.includes(list[i]) ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L14.09 8.26L20.18 8.27L15.18 12.14L17.27 18.27L12 14.77L6.73 18.27L8.82 12.14L3.82 8.27L9.91 8.26L12 2Z"
                fill="yellow"
                stroke="yellow"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L14.09 8.26L20.18 8.27L15.18 12.14L17.27 18.27L12 14.77L6.73 18.27L8.82 12.14L3.82 8.27L9.91 8.26L12 2Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          )}
          {list[i]}
        </button>
      );
    }
    return rows;
  };

  const handleShowDropdown = () => {
    setIsDropDownOpen(!isDropdownOpen);
  };

  const updateSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const clearSearchInput = () => {
    setSearchText('');
  };

  const handleFavorites = (name: string) => {
    if (favorites.includes(name)) {
      const newFav = favorites.filter((el) => el !== name);
      setFavorites(newFav);
    } else {
      const newFav = [...favorites, name];
      setFavorites(newFav);
    }
  };

  useEffect(() => {
    fetch('https://api-eu.okotoki.com/coins', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setAllCoins(data));
  }, []);

  return (
    <div className={s.dropDownWrap}>
      <button onClick={handleShowDropdown} className={s.searchBtn}>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" style={{ fill: '#FFFFFF' }}>
          <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
        </svg>
        search
      </button>
      {isDropdownOpen && (
        <div className={s.dropdown}>
          <div className={s.searchWrap}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" style={{ fill: '#FFFFFF' }}>
              <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
            </svg>
            <input onChange={updateSearchText} value={searchText} type="text" placeholder="Search.." className={s.searchInput} />
            <button onClick={clearSearchInput} className={s.cross}>
              <svg width="10px" height="10px" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.32129 2.32363C2.72582 1.9191 3.38168 1.9191 3.78621 2.32363L25.6966 24.234C26.1011 24.6385 26.1011 25.2944 25.6966 25.6989C25.292 26.1035 24.6362 26.1035 24.2316 25.6989L2.32129 3.78857C1.91676 3.38404 1.91676 2.72818 2.32129 2.32363Z" fill="rgb(63, 142, 168)" />
                <path d="M25.6787 2.30339C25.2742 1.89886 24.6183 1.89886 24.2138 2.30339L2.30339 24.2138C1.89886 24.6183 1.89886 25.2742 2.30339 25.6787C2.70792 26.0832 3.36379 26.0832 3.76831 25.6787L25.6787 3.76831C26.0832 3.36379 26.0832 2.70792 25.6787 2.30339Z" fill="rgb(63, 142, 168)" />
              </svg>
            </button>
          </div>
          <div className={s.choiceWrap}>
            <button onClick={() => setChoiceFlag(true)} className={`${s.favoritesBtn} ${choiceFlag && s.colored}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.09 8.26L20.18 8.27L15.18 12.14L17.27 18.27L12 14.77L6.73 18.27L8.82 12.14L3.82 8.27L9.91 8.26L12 2Z" fill="yellow" stroke="yellow" strokeWidth="2" />
              </svg>
              favorites
            </button>
            <button onClick={() => setChoiceFlag(false)} className={`${s.allCoinsBtn} ${!choiceFlag && s.colored}`}>
              all coins
            </button>
          </div>
          <div onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} style={{ height: `${windowHeight}px`, overflowY: 'auto', position: 'relative' }} className={s.dataWrap}>
            {!choiceFlag ? (
              !searchText.length ? (
                <div style={{ height: allCoins.length * itemHeight, position: 'relative' }}>{generateRows(allCoins)}</div>
              ) : (
                <div style={{ height: filteredCoins.length * itemHeight, position: 'relative' }}>{generateRows(filteredCoins)}</div>
              )
            ) : !searchText.length ? (
              <div style={{ height: favorites.length * itemHeight, position: 'relative' }}>{generateRows(favorites)}</div>
            ) : (
              <div style={{ height: filteredFavorites.length * itemHeight, position: 'relative' }}>{generateRows(filteredFavorites)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}