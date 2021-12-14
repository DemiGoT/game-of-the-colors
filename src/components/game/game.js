import cancel from '../../assets/cancel.png';
import React, { useState } from 'react';
import crown from '../../assets/crown.png';
import ears from '../../assets/ears.png';
import { getColors } from './colors';
import './game.css';

function Game() {

    const [arrays, setArrays] = useState();
    const [inputValue, setInputValue] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [colorsList, setColorsList] = useState();
    const [type, setType] = useState('');

    const checkForEndGame = () => {
        let found = 0;
        let error = 0;

        colorsList.forEach((item) => {

            if (item.found) {
                found = found + 1;
                return;
            }

            if (item.error) {
                error = error + 1;
                return;
            }
        })

        let rez = found + error;

        if (colorsList.length === rez && found === error) {
            alert("Draw, you need more practice");
            arraysLoad(inputValue.count);
            return;
        }

        if (colorsList.length === rez && found > error) {
            alert("You win that game, but u can try more");
            arraysLoad(inputValue.count);
            return;
        }

        if (colorsList.length === rez && found < error) {
            alert("You lose, need more practice");
            arraysLoad(inputValue.count);
            return;
        }

    }

    const arraysLoad = (value) => {

        const numbers = /^[0-9\b]+$/;

        if (!value) {
            return alert('Field is required');
        }
        if (!value.match(numbers)) {
            return alert("Field must have only numbers");
        }
        if (value >= 6) {
            return alert('Field cannot be more than five');
        }

        const newValue = parseInt(value);
        const newColors = getColors();

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        const items = shuffle(newColors).slice(0, newValue * newValue);
        setColorsList(items.slice());

        function fillSquareRandomColors() {
            let newItems = [];
            for (let i = 0; i < newValue; i++) {
                let idx = Math.floor(Math.random() * items.length);
                newItems.push(items[idx]);
                items.splice(idx, 1);
            }
            return newItems;
        }

        setArrays([...Array(newValue)].map(item => fillSquareRandomColors()));

    };

    function handleChange(event) {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const validation = (value, category) => {

        if (selectedItem === value && type === category) {
            if (category === 'square') {
                selectedItem.squareClassName = '';
            } else {
                selectedItem.textClassName = '';
            }
            setSelectedItem(null);
            return;
        }

        if (selectedItem && type === category) {
            if (category === 'square') {
                selectedItem.squareClassName = '';
                value.squareClassName = 'selected';
            } else {
                selectedItem.textClassName = '';
                value.textClassName = 'selected';
            }
            setSelectedItem(value);
            return;
        }

        if (value.disabled) {
            const name = value.name[0].toUpperCase() + value.name.slice(1);
            alert(`${(name)} is already done, please, select other colors`);
            setSelectedItem(null);
            return;
        }

        if (selectedItem && selectedItem.name === value.name) {
            const newColorsList = [...colorsList];
            colorsList.forEach((item, index) => {
                if (item.name === selectedItem.name) {
                    newColorsList[index].found = true;
                    newColorsList[index].disabled = true;
                    newColorsList[index].squareClassName = 'correct';
                    newColorsList[index].textClassName = '';
                }
            })

            setColorsList(newColorsList);
            setType('');
            setSelectedItem(null);
            checkForEndGame();
            return;
        }

        if (selectedItem && selectedItem.name !== value.name) {
            const newColorsList = [...colorsList];
            colorsList.forEach((item, index) => {
                if (item.name === selectedItem.name) {
                    newColorsList[index].error = true;
                    newColorsList[index].disabled = true;
                    newColorsList[index].squareClassName = 'error';
                    newColorsList[index].textClassName = '';
                }
            })

            setColorsList(newColorsList);
            setType('');
            setSelectedItem(null);
            checkForEndGame();
            return;
        }

        if (!selectedItem && category === 'square') {
            value.squareClassName = 'selected';
            setSelectedItem(value);
            setType(category)
            return;
        }

        if (!selectedItem && category === 'text') {
            value.textClassName = 'selected';
            setSelectedItem(value);
            setType(category)
            return;
        }

    }

    return (
        <main className="main">
            <div className="main-wrap">
                <input className="main__input" name="count" placeholder="Enter a number from 2 to 5" type="text" defaultValue='' onChange={(e) => handleChange(e)} />
                <button className="main__button" onClick={() => arraysLoad(inputValue.count)}>Start game</button>
            </div>
            {arrays &&
                <div className="game">
                    <div className="game-letters">
                        {colorsList.map((item) => {
                            return (
                                <div className="game-letters-wrap" key={item.name}>
                                    {item.found &&
                                        <img className="game-letters__img" src={crown} alt={crown}></img>
                                    }
                                    {item.error &&
                                        <img className="game-letters__img" src={cancel} alt={cancel}></img>
                                    }
                                    <p className={`game-letters__text ${item.textClassName}`} onClick={() => validation(item, 'text')}>{item.name}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="game-square" style={{ gridTemplateColumns: `repeat(${arrays.length}, 55px)` }}>
                        <div className="game-square-img">
                            <img width="150px" height="150px" className="game-square-img__img" src={ears} alt={ears}></img>
                        </div>
                        <span className="game-square__animation"></span>
                        <span className="game-square__animation"></span>
                        <span className="game-square__animation"></span>
                        <span className="game-square__animation"></span>
                        {arrays.map((i) => {
                            return (
                                i.map((j) => {
                                    return (
                                        <div className={`game-square__item ${j.name} ${j.squareClassName}`} key={j.name} onClick={() => validation(j, 'square')}></div>
                                    )
                                })
                            )
                        })
                        }
                    </div>
                </div>
            }
        </main>
    );
}

export default Game;