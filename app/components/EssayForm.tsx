// credit: https://codepen.io/austinlyons/pen/ZLEKgN

import React from 'react';
import ReactJson from 'react-json-view';
import {TextField, Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel} from "@material-ui/core";

const startingTree = { name: "compilationUnit" };

enum AvailableParsers {
  Java9 = "Java9",
  Markdown = "Markdown",
}

const availableParsers = [{ value: AvailableParsers.Java9, label: "Java" },
{ value: AvailableParsers.Markdown, label: "Markdown" }];

export class EssayForm extends React.Component<{}, {
  code: string,
  parserChoice: AvailableParsers,
  ast: any
}> {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      parserChoice: availableParsers[0].value,
      ast: startingTree,
    };
  }

  handleCodeChange = (event) => {
    this.setState({ ...this.state, code: event.target.value });
  }

  handleParserChoiceChange = (event) => {
    this.setState({ ...this.state, parserChoice: event.target.value })
  }

  handleSubmit = (event) => {
    console.log('An essay was submitted: ' + this.state.code);
    event.preventDefault();

    const data = { code: this.state.code, parserChoice: this.state.parserChoice };

    return fetch('/parse', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then(response => response.json()) // parses response to JSON
      .then(j => this.setState({ ...this.state, ast: j.ast }))
      .catch(error => console.error(error));
  }

  renderTree (tree) {
    return JSON.stringify(tree);
  }

  radioInputs(name, valueAndLabelses) {
    const oneInput = (value, label) => {
      return <FormControlLabel value={value} name={name} control={<Radio/>} label={label}/>
    }
    return valueAndLabelses.map(o => oneInput(o.value, o.label));
  }

  render() {
    return (
      <div style={{display:"flex"}}>
        <div className="essayForm"
          style={{width: "50%"}}>
          <form 
            onSubmit={this.handleSubmit}
            style={{backgroundColor: "#f0f0f0", width: "100%"}}
          >
            <FormControl>
              <FormLabel component="legend">Choose A Parser</FormLabel>
                <RadioGroup
                value={this.state.parserChoice}
                onChange={this.handleParserChoiceChange}>
                  {this.radioInputs("parserChoice", availableParsers)}
                </RadioGroup>
            </FormControl>
            <TextField 
              style={{margin: "1em", width: "100%"}}
              label="Code To Parse"
              value={this.state.code}
              variant="outlined" 
              onChange={this.handleCodeChange}
              multiline
              rows={15} 
            />
            <Button 
              style={{margin: "1em"}}
              variant="contained" 
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
        <div className="preview"
          style={{width: "50%"}}>
          <ReactJson 
            src={this.state.ast}
            theme="apathy"
            displayDataTypes={false}
            onSelect={(select) => console.log("Selected: " + JSON.stringify(select))}
          />
        </div>
      </div>
    );
  }

}