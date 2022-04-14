import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import * as d3 from 'd3';
import fullDataFile from './data/FullerData_CUReviews.csv';

export default class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            fullData: [],
            selectedClasses: []
        };

        this.createViz = this.createViz.bind(this);
        this.changeClass = this.changeClass.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.plotClassInfo = this.plotClassInfo.bind(this);
    }

    async createViz() {
        let div = d3.select('#viz');
        //let svg = div.append('svg')
        //             .attr('width', 1000)
        //             .attr('height', 500)
        let classData = await d3.csv('Classes_With_Medians.csv');
        let profData = await d3.csv('RMP/RMP.csv');
        let data = await d3.csv(fullDataFile);
        this.setState({ fullData: data });

        let profs = [];
        classData.forEach(d => {
            profs.push(d.Professor);
        })
    }

    plotClassInfo() {
        let class_data = this.updateSearch()
        let svg = d3.select("#class-info-plot")
            .append('svg')
            .attr('height', 500)
            .attr('width', 1000)

        let classes = [{ 'Class': 'CS 1110', 'Median': 'A', 'Num': 0 }, { 'Class': 'CS 2110', 'Median': 'A+', 'Num': 1 }];

        let box = svg.selectAll('g')
            .data(classes)
            .enter()
            .append('g')

        box.selectAll('rect')
            .data(classes)
            .join('rect')
            .attr('x', 150)
            .attr('y', 50)
            .attr('width', 200)
            .attr('height', 200)
            .style('fill', 'orange')
            .text('test')

        let list = d3.select('#class-info');
        list.selectAll('li.class-info-list')
            .data(classes)
            .join('li')
            .attr('class', 'class-info-list')
            .text()

        // Top text gets hidden - need to have separate g tags for the box and text, and raise the text one
        let text = box.append('text')
            .attr('x', 150)
            .attr('y', d => d['Num'] * 100 + 100)
            .text(d => d.Class + ' has an ' + d.Median + ' median')
        text.raise()

        // Update Table
        let tableBody = d3.select('#class-info-table tbody');
        let tableHeader = d3.select('#class-info-header');
        let tableRows = tableBody.selectAll('tr')
            .data(class_data)
            .join('tr')

        let tableRowEntries = tableRows.selectAll('td')
            .data((d) => {
                return [d['Dept + Number'], d['Course_Name'], d['Professor'], d['Semester (Ex: SP21)']]
            })
            .join('td')
            .text(d => d)
        //tableHeader.append("th").text('Additional Info');
        console.log(tableHeader);
        d3.select('#class-info-header-row').selectAll('th')
            .data(['Course #', 'Class', 'Professor', 'Semester', 'Additional Info'])
            .join("th")
            .text(d => d) //'Additional Info');
        tableRows.selectAll('td.table-button')
            .data(d => [d])
            .attr('class', 'table-button')
            .join('td')
            .append('button')
            .text((d) => 'Test')
            .on('click', d => alert(d.srcElement.__data__['Number']))


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
        console.log('UPDATING');
        let departmentChecked = d3.select('#check-1').property('checked');

        let aplusChecked = d3.select('#check-med-1').property('checked');
        let aChecked = d3.select('#check-med-2').property('checked');
        let aminusChecked = d3.select('#check-med-3').property('checked');
        let bplusChecked = d3.select('#check-med-4').property('checked');
        let bChecked = d3.select('#check-med-5').property('checked');
        let bminusChecked = d3.select('#check-med-6').property('checked');
        let medgrades = [];
        if (aplusChecked) {
            medgrades.push("A+")
        }
        if (aChecked) {
            medgrades.push("A")
        }
        if (aminusChecked) {
            medgrades.push("A-")
        }
        if (bplusChecked) {
            medgrades.push("B+")
        }
        if (bChecked) {
            medgrades.push("B")
        }
        if (bminusChecked) {
            medgrades.push("B-")
        }

        let profChecked = d3.select('#check-2').property('checked');
        let courseNumChecked = d3.select('#check-4').property('checked');
        let courseNameChecked = d3.select('#check-5').property('checked');
        let profDifChecked = d3.select('#check-6').property('checked');


        //let medGradeChecked = d3.select('#check-3').property('checked');

        let classes = this.state.fullData;

        console.log('before dep')
        if (departmentChecked) {
            let department = d3.select('#department-text').property('value');
            console.log(department);
            classes = classes.filter(class_ => class_['Dept'] === department);
            console.log(classes);
        }
        console.log('before prof')
        if (profChecked) {
            // filter the previous classes
            let prof = d3.select('#prof-text').property('value');
            console.log('PROF', prof)
            classes = classes.filter(class_ => class_['Professor'].toLowerCase().includes(prof.toLowerCase()));
            console.log(classes)
        }

        if (courseNumChecked) {
            // filter the previous classes
            let courseNum = Number(d3.select('#course-num-text').property('value'));
            console.log(courseNum)
            classes = classes.filter(class_ => Number(class_['Number']) == courseNum);
            console.log(classes)
        }

        if (courseNameChecked) {
            // filter the previous classes
            let course_name = d3.select('#course-name-text').property('value');
            classes = classes.filter(class_ => class_['Course_Name'].toLowerCase().includes(course_name.toLowerCase()));
            console.log(classes)
        }

        if (profDifChecked) {
            // filter the previous classes
            let profDif = Number(d3.select('#prof-diff-text').property('value'));
            console.log(profDif)
            classes = classes.filter(class_ => class_['Difficulty'] != "" && (Number(class_['Difficulty']) <= profDif));
            console.log(classes)
        }


        if (medgrades.length != 0) {
            classes = classes.filter(class_ => medgrades.includes(class_['Median Grade']));
        }

        classes.sort((d1, d2) => {
            return Number(d1['Number']) - Number(d2['Number']);
        });

        console.log('UPDATED CLASSES', classes)

        // this.setState({ selectedClasses: classes });
        return classes
    }

    componentDidMount() {

        this.createViz();

        console.log('FULL DATA');
        console.log(this.state.fullData);

    }


    render() {
        let list;
        if (this.state.showPlot) {
            list = <ul id='class-info'>Class Info</ul>;
        } else {
            list = <ul id='class-info'></ul>;
        }
        return (
            <div className="Home-Page App">

                <h1>Class Visualizer</h1>

                <div>
                    <br />
                    <b>Filter By</b>
                    <div>
                        <input type="checkbox" name="check-1" value="check-1" id="check-1" />
                        <label for="check-1">Department</label>
                        <input id='department-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-2" value="check-2" id="check-2" />
                        <label for="check-2">Professor</label>
                        <input id='prof-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <label>Median Grade</label>
                        {/* <input id='med-grade-text' type="text"></input> */}
                        <br></br>
                        <br></br>
                        <input type="checkbox" id="check-med-1" value="check-med-1" class="check-med" />
                        <label for="check-med-1">A+</label>

                        <input type="checkbox" id="check-med-2" value="check-med-2" class="check-med" />
                        <label for="check-med-2">A</label>

                        <input type="checkbox" id="check-med-3" value="check-med-3" class="check-med" />
                        <label for="check-med-3">A-</label>

                        <input type="checkbox" id="check-med-4" value="check-med-4" class="check-med" />
                        <label for="check-med-4">B+</label>

                        <input type="checkbox" id="check-med-5" value="check-med-5" class="check-med" />
                        <label for="check-med-5">B</label>

                        <input type="checkbox" id="check-med-6" value="check-med-6" class="check-med" />
                        <label for="check-med-6">B-</label>

                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-4" value="check-4" id="check-4" />
                        <label for="check-4">Course Number</label>
                        <input id='course-num-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-5" value="check-5" id="check-5" />
                        <label for="check-5">Course Name</label>
                        <input id='course-name-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-6" value="check-6" id="check-6" />
                        <label for="check-6">Professor Difficulty</label>
                        <input id='prof-diff-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-7" value="check-7" id="check-7" />
                        <label for="check-7">Class Difficulty</label>
                        <input id='class-diff-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-8" value="check-8" id="check-8" />
                        <label for="check-8">Class Rating</label>
                        <input id='class-rat-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-9" value="check-9" id="check-9" />
                        <label for="check-9">Class Workload</label>
                        <input id='class-work-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-10" value="check-10" id="check-10" />
                        <label for="check-10">Start Time</label>
                        <input id='start-time-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-11" value="check-11" id="check-11" />
                        <label for="check-11">End Time</label>
                        <input id='end-time-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <div>
                        <input type="checkbox" name="check-11" value="check-11" id="check-11" />
                        <label for="check-11">Location</label>
                        <input id='location-text' type="text"></input>
                        <br></br>
                        <br></br>
                    </div>

                    <br></br>
                </div>

                <br />

                <div id="selected-class-info"></div>
                <div style={{ align: "center" }}>
                    <br></br>
                    <Button variant="primary" onClick={this.plotClassInfo}>Update Table</Button>{' '}

                    <br></br>
                    <br></br>

                    <table id="class-info-table">
                        <thead id="class-info-header">
                            <tr id="class-info-header-row"></tr>
                        </thead>
                        <tbody></tbody>

                    </table>

                    {list}
                    <div id="class-info-plot"></div>

                </div>



            </div>
        )
    }
}