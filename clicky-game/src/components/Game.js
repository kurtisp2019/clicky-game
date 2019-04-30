/**
 * 
 *      clickyGame.js (component)
 * 
 */

import React, { Component } from 'react';
import axios from "axios";

class Game extends Component { 

    state = {
        m_guessedIndicies: [],
        m_randomIndexArr: [],
        m_listOfImageUrls: [],
        m_nScore: 0,
        m_nTopScore: 0
    };

    randomNumGen() { 

        var bNumExists = false;
        var randomIndexArr = [];
        // loop through the random index array
        while (randomIndexArr.length !== 10) { 

            // find a random number between 0 and 9
            var randomNum = Math.floor(Math.random() * 10);
            for (let i = 0; i < randomIndexArr.length; i++) { 

                // if the random number is already in the array then set the flag and break from the loop
                if (randomNum === randomIndexArr[i]) { 
                    bNumExists = true;
                    i = randomIndexArr.length;
                }
            }

            // if the random number exists dont add it to the array and continue in the loop
            if (bNumExists) {
                bNumExists = false;
                // if it does exists add it to the array
            } else { 
                randomIndexArr.push(randomNum);
            }
        }

        this.setState({m_randomIndexArr: randomIndexArr});
    }

    addUserGuess(_indexOfImg) { 

        // get a copy of the guesses
        var userGuesses = this.state.m_guessedIndicies;
        var bFound = false;

        console.log(userGuesses);
        // check to see if the user has guessed the index already
        userGuesses.forEach(_index => { 
           
            // if the index is equal to the one being added
            if (_index === _indexOfImg) { 

                console.log("repeat found");
                // check to see if they got a new top score
                var topScore = this.state.m_nTopScore;
                if (this.state.m_nScore > this.state.m_nTopScore) { 
                    topScore = this.state.m_nScore;
                }

                var empty = [];

                // reset the score and set the new top score if there was one
                this.setState({ m_guessedIndicies: empty, m_nScore: 0, m_nTopScore: topScore });
                bFound = true;
            }
        });

        if (!bFound) {
            // if none of the guesses were already in the list, add it now
            userGuesses.push(_indexOfImg);
            console.log("guess added");
            // set the new state
            this.setState({ m_nScore: this.state.m_nScore + 1, m_guessedIndicies: userGuesses });
        }

        this.randomNumGen();

    }

    getImages() { 
        var apiKey = "dc6zaTOxFJmzC";
        var searchQuery = "cheeseburgers";
        var limit = 10;
        var qs = "https://api.giphy.com//v1/gifs/search?q=" + searchQuery + "&limit=" + limit + "&api_key=" + apiKey;
        
        axios.get(qs).then(_response => { 

            var images = [];
            _response.data.data.forEach(_image => { 
                // console.log(_image.images.fixed_height_small_still);
                images.push(_image.images.fixed_height_small_still.url);
            });
            
            this.setState({
                m_listOfImageUrls: images
            });
        });
    }

    componentDidMount() {
        this.randomNumGen();
        
        this.getImages();
        
    }

    handleClick = _event => { 
        _event.preventDefault();

        var dataId = _event.target.getAttribute("data-id");

        this.addUserGuess(dataId);
        console.log(dataId);
    }

    render() { 
        return <>
            <p>Game component</p>
            <p>Score: {this.state.m_nScore}</p>
            <p>Top Score: {this.state.m_nTopScore}</p>
            {this.state.m_randomIndexArr.map(_num => <img src={this.state.m_listOfImageUrls[_num]} onClick={this.handleClick} data-id = {_num} alt = "img"></img>)}
        </>;
        }
    };
    
export default Game;