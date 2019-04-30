/**
 * 
 *      clickyGame.js (component)
 * 
 */

import React, { Component } from 'react';
import styled from "styled-components";
import giphyApi from "../util/giphyAPI";


var ImgStyled = styled.img`
    border: 1px solid green;
    margin: 5px;
`

var HeaderBar = styled.div`
    background-color: purple;
    width: 100%;
    height: 50px;
    color: white;
    padding-left: 30px;
    padding-right: 30px;
    font-size: 33px;
`

class Game extends Component { 

    state = {
        m_guessedIndicies: [],
        m_randomIndexArr: [],
        m_listOfImageUrls: [],
        m_nScore: 0,
        m_nTopScore: 0,
        m_szUserInstruction: "Click an image to begin!",
        m_szUserInstructions: ["Click an image to begin!", "You guessed correctly!", "You guessed incorrectly!"]
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

                //console.log("repeat found");

                // check to see if they got a new top score
                var topScore = this.state.m_nTopScore;
                if (this.state.m_nScore > this.state.m_nTopScore) { 
                    topScore = this.state.m_nScore;
                }

                var empty = [];

                // reset the score and set the new top score if there was one
                this.setState({ m_szUserInstruction: this.state.m_szUserInstructions[2], m_guessedIndicies: empty, m_nScore: 0, m_nTopScore: topScore });
                bFound = true;
            }
        });

        if (!bFound) {
            // if none of the guesses were already in the list, add it now
            userGuesses.push(_indexOfImg);
            console.log("guess added");
            // set the new state
            this.setState({ m_szUserInstruction: this.state.m_szUserInstructions[1], m_nScore: this.state.m_nScore + 1, m_guessedIndicies: userGuesses });
        }

        this.randomNumGen();

    }

    getImages() { 
        giphyApi.getImages().then(_response => { 

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
        return (<div style={{ width: 1000, backgroundColor: "orange"}}>
            <HeaderBar>
                <span>Clicky Game!</span>
                <span style={{marginLeft: 100}}>{this.state.m_szUserInstruction}</span>
                <span style={{float: "right"}}>Score: {this.state.m_nScore}  |  Top Score: {this.state.m_nTopScore}</span>
            </HeaderBar>
       
            {this.state.m_randomIndexArr.map(_num =>
                <ImgStyled
                key={_num}
                src={this.state.m_listOfImageUrls[_num]}
                onClick={this.handleClick}
                data-id={_num}
                    alt="img"></ImgStyled>)}
            <HeaderBar></HeaderBar>
        </div>);
        }
    };
    
export default Game;