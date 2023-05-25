import {css} from 'lit';

export const styles = css`
#buttonContainer {
    position: absolute;
    width: 20%;
    max-width: 200px;
    min-width: 100px;
    top: 5%;
    left: 2%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: auto;
    background-color: #3a3a3a;
    border-radius: 20px;
}

.toggleButton {
    padding: 8px 12px;
    background-color: #3a3a3a;
    border: none 2px #cbc118;
    cursor: pointer;
    font-size: 44px;
    margin: 4px;
    width: 80%;
    height: 50px;
    display: flex;
    //justify-content: center;
    align-items: center;
}

.buttonDescription{
    font-size: 13px;
    color:  #cbc118 ;
    user-select: none;
    margin-left: 20px;
}

.groupTitle{
    font-family: "Arial MT Black";
    font-size: 20px;
    text-align: center;
    color:  #cbc118 ;
    user-select: none;
}

.buttonContent {
    display: flex;
    align-items: center;
    justify-content: start;
}`
