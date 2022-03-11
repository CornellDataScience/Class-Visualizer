import React, { Component } from 'react';
import * as d3 from 'd3';
import fullDataFile from './data/Full_Data.csv';

export default class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            fullData: {}
        };

        this.createViz = this.createViz.bind(this);
        this.changeClass = this.changeClass.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
    }

    async createViz() {
        let div = d3.select('#viz');
        //let svg = div.append('svg')
        //             .attr('width', 1000)
        //             .attr('height', 500)
        let classData = await d3.csv('Classes_With_Medians.csv');
        let profData = await d3.csv('RMP/RMP.csv');
        let data = await d3.csv(fullDataFile);
        this.setState({fullData: data});

        let profs = [];
        classData.forEach(d => {
            profs.push(d.Professor);
        })
    }

    changeClass() {
        let className = d3.select(this).property("value");
        console.log(className);
        console.log(this.state.fullData);
  
        let classObj = this.state.fullData.find(class_ => class_['Dept + Number'] === className);
        console.log(classObj);
  
        let courseName = classObj['Course_Name'];
        let prof = classObj['Professor']
        let medGrade = classObj['Median Grade'];
        let difficulty = classObj['Difficulty'];
        let avgRating = classObj['Average_Rating'];
  
  
        let div = d3.select('#selected-class-info');
        div.selectAll('*').remove();
        div.append('p').text(courseName);
        div.append('p').text(prof);
        div.append('p').text(medGrade);
        div.append('p').text(difficulty);
        div.append('p').text(avgRating);
    }

    updateSearch() {
        let departmentChecked = d3.select('#check-1').property('checked');
        let profChecked = d3.select('#check-2').property('checked');
        let medGradeChecked = d3.select('#check-3').property('checked');

        let classes = this.state.fullData;
  
        if (departmentChecked) {
          let department = d3.select('#department-text').property('value');
          console.log(department);
          classes = classes.filter(class_ => class_['Dept'] === department);
          console.log(classes);
        }
  
        if (profChecked) {
          // filter the previous classes
          let prof = d3.select('#prof-text').property('value');
          classes = classes.filter(class_ => class_['Professor'] === prof);
          console.log(classes)
        }
  
        if (medGradeChecked) {
          let medGrade = d3.select('#med-grade-text').property('value');
          classes = classes.filter(class_ => class_['Median Grade'] === medGrade);
          console.log(classes);
        }
      }

    componentDidMount() {
        this.createViz();
        d3.select('#prof-select-sel').on('change', this.changeClass);
        d3.select('#class-search').on('click', this.updateSearch);
    }


    render() {
        return (
            <div className = "Home-Page">
                <h1>Class Visualizer</h1>

                <div>
                <br />
                <b>Filter By</b>
                <div>
                    <input type="checkbox" name="check-1" value="check-1" id="check-1" />
                    <label for="check-1">Department</label>
                    <input id = 'department-text' type="text"></input>
                </div>

                <div>
                    <input type="checkbox" name="check-2" value="check-2" id="check-2" />
                    <label for="check-2">Professor</label>
                    <input id = 'prof-text' type="text"></input>
                </div>

                <div>
                    <input type="checkbox" name="check-3" value="check-3" id="check-3" />
                    <label for="check-3">Median Grade</label>
                    <input id = 'med-grade-text' type="text"></input>
                </div>

                <button id = 'class-search'>Search</button>
                </div>

                <br />
                <label id="prof-select-lab">Class: </label>
                    <select id="prof-select-sel">
                    
                    {/* style={{width:'200px', margin-right: '50px', margin-left: '5px', margin-top: '15px'}} */}
                    <option value="CS 1110" selected>CS 1110</option>
                    <option value="CS 2110">CS 2110</option>
                    <option value="CS 3110">CS 3110</option>
                    </select>
                <div id="selected-class-info"></div>
            </div>
        )
    }
}