import React, { Component } from 'react';
import * as d3 from 'd3';
import fullDataFileSP from './data/FullerData_CUReviews.csv';
import fullDataFile from './data/FullerData_CUReviews_FA22.csv';
import { BasicSlider } from './BasicSlider.jsx';
import { Button, ButtonGroup, ButtonToolbar, InputGroup, FormControl } from 'react-bootstrap';

export default class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            fullData: [],
            selectedClasses: [],
            sliderVal1: 0,
            sliderVal2: 0
            // sliderVal3: 0,
            // sliderVal4: 0,
        };

        this.createViz = this.createViz.bind(this);
        this.changeClass = this.changeClass.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.plotClassInfo = this.plotClassInfo.bind(this);
        this.setSliderVal1 = this.setSliderVal1.bind(this);
        this.setSliderVal2 = this.setSliderVal2.bind(this);

        // this.setSliderVal3 = this.setSliderVal3.bind(this)
        // this.setSliderVal4 = this.setSliderVal4.bind(this)


        this.updateSemester = this.updateSemester(this)
    }

    setSliderVal1(newVal) {
        this.setState({ 'sliderVal1': newVal })
    }

    setSliderVal2(newVal) {
        this.setState({ 'sliderVal2': newVal })
    }

    // setSliderVal3(newVal) {
    //     this.setState({ 'sliderVal3': newVal })
    // }

    // setSliderVal4(newVal) {
    //     this.setState({ 'sliderVal4': newVal })
    // }

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

        //let classes = [{ 'Class': 'CS 1110', 'Median': 'A', 'Num': 0 }, { 'Class': 'CS 2110', 'Median': 'A+', 'Num': 1 }];

        // let box = svg.selectAll('g')
        //  .data(classes)
        //  .enter()
        //   .append('g')

        // box.selectAll('rect')
        //     .data(classes)
        //     .join('rect')
        //     .attr('x', 150)
        //     .attr('y', 50)
        //     .attr('width', 200)
        //     .attr('height', 200)
        //     .style('fill', 'orange')
        //     .text('test')

        let list = d3.select('#class-info');
        // list.selectAll('li.class-info-list')
        //     .data(classes)
        //     .join('li')
        //     .attr('class', 'class-info-list')
        //     .text()

        // Top text gets hidden - need to have separate g tags for the box and text, and raise the text one
        // let text = box.append('text')
        //     .attr('x', 150)
        //     .attr('y', d => d['Num'] * 100 + 100)
        //     .text(d => d.Class + ' has an ' + d.Median + ' median')
        // text.raise()

        // Update Table
        let tableBody = d3.select('#class-info-table tbody');
        let tableHeader = d3.select('#class-info-header');
        let tableRows = tableBody.selectAll('tr')
            .data(class_data)
            .join('tr')

        let tableRowEntries = tableRows.selectAll('td')
            .data((d) => {
                return [d['Dept + Number'], d['Course_Name'], d['Professor']]
            })
            .join('td')
            .text(d => d)
        //tableHeader.append("th").text('Additional Info');
        console.log(tableHeader);
        d3.select('#class-info-header-row').selectAll('th')
            .data(['Course #', 'Class', 'Professor', 'Additional Info'])
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

    async updateSemester() {
        console.log('UPDATING');
        console.log('P');
        let p = d3.select('#sem').node().value;
        console.log(p)
        if (p === "FA22") {
            let data = await d3.csv(fullDataFile);
            this.setState({ fullData: data });
        } else if (p === "SP22") {
            let data = await d3.csv(fullDataFileSP);
            this.setState({ fullData: data });
        }

    }



    updateSearch() {


        // let aplusChecked = d3.select('#check-med-1').property('checked');
        // let aChecked = d3.select('#check-med-2').property('checked');
        // let aminusChecked = d3.select('#check-med-3').property('checked');
        // let bplusChecked = d3.select('#check-med-4').property('checked');
        // let bChecked = d3.select('#check-med-5').property('checked');
        // let bminusChecked = d3.select('#check-med-6').property('checked');
        let medgrades = [];
        // if (aplusChecked) {
        //     medgrades.push("A+")
        // }
        // if (aChecked) {
        //     medgrades.push("A")
        // }
        // if (aminusChecked) {
        //     medgrades.push("A-")
        // }
        // if (bplusChecked) {
        //     medgrades.push("B+")
        // }
        // if (bChecked) {
        //     medgrades.push("B")
        // }
        // if (bminusChecked) {
        //     medgrades.push("B-")
        // }

        // let courseNameChecked = d3.select('#check-5').property('checked');
        // let profDifChecked = d3.select('#check-6').property('checked');
        // let classDifChecked = d3.select('#check-7').property('checked')
        // let classRatingChecked = d3.select('#check-8').property('checked')
        // let classWorloadChecked = d3.select('#check-9').property('checked')
        // let startTimeChecked = d3.select('#check-10').property('checked')
        // let endTimeChecked = d3.select('#check-11').property('checked')

        //let medGradeChecked = d3.select('#check-3').property('checked');

        let classes = this.state.fullData;

        console.log('before dep')
        let department = d3.select('#department-text').property('value');
        console.log(department);
        if (department !== '') {
            classes = classes.filter(class_ => class_['Dept'].toLowerCase().includes(department.toLowerCase()));
            console.log(classes);
        }
        let prof = d3.select('#prof-text').property('value');
        if (prof !== '') {
            // filter the previous classes
            classes = classes.filter(class_ => class_['Professor'].toLowerCase().includes(prof.toLowerCase()));
            console.log(classes)
        }

        let courseNum = Number(d3.select('#course-num-text').property('value'));
        if (courseNum !== 0) {
            // filter the previous classes
            classes = classes.filter(class_ => Number(class_['Number']) === courseNum);
            console.log(classes)
        }

        let courseName = d3.select('#course-name-text').property('value');
        if (courseName !== '') {
            // filter the previous classes
            classes = classes.filter(class_ => class_['Course_Name'].toLowerCase().includes(courseName.toLowerCase()));
            console.log('COURSE NAME FILTER')
            console.log(classes);
        }

        // let profDif = Number(d3.select('#prof-diff-text').property('value'));
        let profDifSlider = d3.select('#prof-diff-slider')//.attr('minimum')//.handle.value;
        console.log('Slide');
        console.log(profDifSlider);
        let val1 = this.state.sliderVal1;
        let val2 = this.state.sliderVal2;
        console.log(val2)
        if (!(val1 == 1 && val2 == 5)) {
            // filter the previous classes
            console.log(val1)
            classes = classes.filter(class_ => class_['Difficulty'] !== "" && (Number(class_['Difficulty']) <= val2 && Number(class_['Difficulty']) >= val1));
            console.log(classes)
        }
        console.log(val2)
        let classDif = Number(d3.select('#class-diff-text').property('value'));
        // let classDifSlider = d3.select('#class-diff-slider')
        // let val3 = this.state.sliderVal3;
        // let val4 = this.state.sliderVal4;
        if (classDif !== 0) {
            // if (val3 !== 1 && val4 !== 5) {
            // filter the previous classes
            classes = classes.filter(class_ => class_['CU_Reviews_Difficulty'] !== "" && (Number(class_['CU_Reviews_Difficulty']) <= classDif));

            // classes = classes.filter(class_ => class_['CU_Reviews_Difficulty'] !== "" && (Number(class_['CU_Reviews_Difficulty']) <= val4 && Number(class_['CU_Reviews_Difficulty']) >= val3));
            console.log(classes)
        }

        let classRate = Number(d3.select('#class-rat-text').property('value'));
        if (classRate !== 0) {
            classes = classes.filter(class_ => class_['CU_Reviews_Rating'] !== "" && (Number(class_['CU_Reviews_Rating']) >= classRate));
            console.log(classes)
        }

        let classWork = Number(d3.select('#class-work-text').property('value'));
        if (classWork !== 0) {
            classes = classes.filter(class_ => class_['CU_Reviews_Workload'] !== "" && (Number(class_['CU_Reviews_Workload']) <= classWork));
            console.log(classes)
        }

        let startTime = d3.select('#start-time-text').property('value');
        if (startTime !== '') {
            classes = classes.filter(class_ => class_['Start_Time'].includes(startTime));
            console.log(classes)
        }

        let endTime = d3.select('#end-time-text').property('value');
        if (endTime !== '') {
            classes = classes.filter(class_ => class_['End_Time'].includes(endTime));
            console.log(classes)
        }


        if (medgrades.length !== 0) {
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

        d3.selectAll('.text-input').on('change', this.plotClassInfo)
        d3.select('#sem').on('change', this.updateSemester)

        console.log('FULL DATA');
        console.log(this.state.fullData);

    }

    componentDidUpdate() {
        this.plotClassInfo()
    }


    render() {
        let list;

        console.log('SLIDER VAL')
        console.log(this.state.sliderVal1)
        console.log(this.state.sliderVal2)
        // console.log(this.state.sliderVal3)
        // console.log(this.state.sliderVal4)

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

                    <div class="row">
                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-1" value="check-1" id="check-1" /> */}
                                <label for="check-1">Department</label>
                                <input class="text-input" id='department-text' type="text" placeholder="Enter Department..."></input>

                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-2" value="check-2" id="check-2" /> */}
                                <label for="check-2">Professor</label>
                                <input class="text-input" id='prof-text' type="text" placeholder="Enter Prof Name..."></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-4" value="check-4" id="check-4" /> */}
                                <label for="check-4">Course Number</label>
                                <input class="text-input" id='course-num-text' type="text" placeholder="ex: 1110"></input>
                                <br></br>
                            </div>

                        </div>


                    </div>

                    <div>
                        <ButtonToolbar className="justify-content-center" aria-label="Toolbar with Button groups">
                            <label class="med-grade-text">Median Grade</label>
                            <ButtonGroup aria-label="First group">
                                <Button variant="secondary">A+</Button>{' '}
                                <Button variant="secondary">A</Button>{' '}
                                <Button variant="secondary">A-</Button>{' '}
                                <Button variant="secondary">B+</Button>{' '}
                                <Button variant="secondary">B</Button>{' '}
                                <Button variant="secondary">B-</Button>
                            </ButtonGroup>
                        </ButtonToolbar>

                        <div class="row">
                            <div class="col">
                                <input type="checkbox" id="check-med-1" value="check-med-1" class="check-med" />
                                <label for="check-med-1">A+</label>
                            </div>

                            <div class="col">
                                <input type="checkbox" id="check-med-2" value="check-med-2" class="check-med" />
                                <label for="check-med-2">A</label>
                            </div>

                            <div class="col">
                                <input type="checkbox" id="check-med-3" value="check-med-3" class="check-med" />
                                <label for="check-med-3">A-</label>
                            </div>

                            <div class="col">
                                <input type="checkbox" id="check-med-4" value="check-med-4" class="check-med" />
                                <label for="check-med-4">B+</label>
                            </div>

                            <div class="col">
                                <input type="checkbox" id="check-med-5" value="check-med-5" class="check-med" />
                                <label for="check-med-5">B</label>
                            </div>

                            <div class="col">
                                <input type="checkbox" id="check-med-6" value="check-med-6" class="check-med" />
                                <label for="check-med-6">B-</label>
                            </div>
                        </div>

                    </div>

                    <div class="row">
                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-5" value="check-5" id="check-5" /> */}
                                <label for="check-5">Course Name</label>
                                <input class="text-input" id='course-name-text' type="text" placeholder="Enter course name..."></input>
                                <br></br>
                            </div>
                        </div>
                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-6" value="check-6" id="check-6" /> */}
                                <label for="check-6">Professor Difficulty</label>
                                {/* <input class="text-input" id='prof-diff-text' type="text" placeholder="From RateMyProf, 0...5"></input> */}
                                <BasicSlider id="prof-diff-slider" updateVal1={this.setSliderVal1} updateVal2={this.setSliderVal2} minimum={1} maximum={5} time={false} ></BasicSlider>

                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-7" value="check-7" id="check-7" /> */}
                                <label for="check-7">Class Difficulty</label>
                                <input class="text-input" id='class-diff-text' type="text" placeholder="From CUReviews, 0...5"></input>
                                {/* <BasicSlider id="class-diff-slider" updateVal1={this.setSliderVal3} updateVal2={this.setSliderVal4} minimum={1} maximum={5} time={false} ></BasicSlider> */}

                                <br></br>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-8" value="check-8" id="check-8" /> */}
                                <label for="check-8">Class Rating</label>
                                <input class="text-input" id='class-rat-text' type="text" placeholder="From CUReviews, 0...5"></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-9" value="check-9" id="check-9" /> */}
                                <label for="check-9">Class Workload</label>
                                <input class="text-input" id='class-work-text' type="text" placeholder="From CUReviews, 0...5"></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                {/* <input type="checkbox" name="check-10" value="check-10" id="check-10" /> */}
                                <label for="check-10">Start Time</label>
                                <input class="text-input" id='start-time-text' type="text" placeholder="Enter start time..."></input>
                                {/* <BasicSlider minimum={1} maximum={5} time={true}></BasicSlider> */}

                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                <input type="checkbox" name="check-11" value="check-11" id="check-11" />
                                <label for="check-11">End Time</label>
                                <input class="text-input" id='end-time-text' type="text" placeholder="Enter end time..."></input>
                                <br></br>
                            </div>
                        </div>
                        <div>
                            <form action="#">
                                <label for="sem">Semester</label>
                                <select name="sem" id="sem">
                                    <option value="FA22">FA '22</option>
                                    <option value="SP22">SP '22</option>
                                </select>
                                {/* <input type="submit" value="Submit" /> */}
                            </form>
                        </div>
                    </div>
                    <br></br>
                </div>

                <br />

                <div id="selected-class-info"></div>
                <div style={{ align: "center" }}>
                    <br></br>

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



            </div >
        )
    }
}