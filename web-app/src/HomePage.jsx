import React, { Component } from 'react';
import * as d3 from 'd3';
import fullDataFileSP from './data/FullerData_CUReviews_shortened.csv';
import fullDataFile from './data/FullerData_CUReviews_FA22_shortened.csv';
import { BasicSlider } from './BasicSlider.jsx';
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, ToggleButton } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import CDSLogo from './images/cds_logo.png';
import EZALogo from './images/ez-a-logo.png'
import loadingGIF from './images/hourglass.gif';
import Switch from "react-switch";
let show = false;


export default class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            fullData: [],
            fallData: [],
            springData: [],
            selectedClasses: ['Dept + Number', 'Course_Name', 'Professor'],
            sliderVal1: 0,
            sliderVal2: 0,
            sliderVal3: 0,
            sliderVal4: 0,
            sliderVal5: 0,
            sliderVal6: 0,
            sliderVal7: 0,
            sliderVal8: 0,
            medianGrades: [],
            fieldsShown: ['Dept', 'Number', 'Course_Name', 'Professor', 'Median Grade', 'CU_Reviews_Rating', 'CU_Reviews_Difficulty', 'CU_Reviews_Workload', 'Difficulty', 'Start_Time', 'End_Time'],
            oldFieldsShown: [],
            toggle: false,
            sortMethod: "dept",
            semesterText: "FA '22",
            sortByText: "Department",
            savedClasses: [],
            headers: ['Department', 'Course Number', 'Course Name', 'Professor', 'Median Grade', 'Class Rating',
                'Class Difficulty', 'Class Workload', 'Professor Difficulty', 'Start Time', 'End Time'],
            loading: true,
            checked: false,
        };
        this.allGrades = ['B-', 'B', 'B+', 'A-', 'A', 'A+'];
        this.fieldMapping = {
            'Dept': 'Department',
            'Professor': 'Professor',
            'Number': 'Course Number',
            'Course_Name': 'Course Name',
            'Start_Time': 'Start Time',
            'End_Time': 'End Time',
            'Difficulty': 'Professor Difficulty',
            'CU_Reviews_Difficulty': 'Class Difficulty',
            'CU_Reviews_Rating': 'Class Rating',
            'CU_Reviews_Workload': 'Class Workload',
            'Median Grade': 'Median Grade'
        }

        this.medGradeMapping = {
            "A+": 10, "A": 9, "A-": 8, "B+": 7, "B": 6, "B-": 5
        }

        this.createViz = this.createViz.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.updateSemester = this.updateSemester.bind(this);
        this.updateSortBy = this.updateSortBy.bind(this);
        this.plotClassInfo = this.plotClassInfo.bind(this);
        this.updateMedianGrade = this.updateMedianGrade.bind(this);
        this.toggleTableInfo = this.toggleTableInfo.bind(this);
        this.generatePlots = this.generatePlots.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.setSliderVal1 = this.setSliderVal1.bind(this);
        this.setSliderVal2 = this.setSliderVal2.bind(this);
        this.setSliderVal3 = this.setSliderVal3.bind(this)
        this.setSliderVal4 = this.setSliderVal4.bind(this)
        this.setSliderVal5 = this.setSliderVal5.bind(this)
        this.setSliderVal6 = this.setSliderVal6.bind(this)
        this.setSliderVal7 = this.setSliderVal7.bind(this)
        this.setSliderVal8 = this.setSliderVal8.bind(this)
    }

    handleChange(checked) {
        this.setState({ checked }, this.plotClassInfo)
    }

    setSliderVal1(newVal) {
        this.setState({ 'sliderVal1': newVal })
    }

    setSliderVal2(newVal) {
        this.setState({ 'sliderVal2': newVal })
    }

    setSliderVal3(newVal) {
        this.setState({ 'sliderVal3': newVal })
    }

    setSliderVal4(newVal) {
        this.setState({ 'sliderVal4': newVal })
    }

    setSliderVal5(newVal) {
        this.setState({ 'sliderVal5': newVal })
    }

    setSliderVal6(newVal) {
        this.setState({ 'sliderVal6': newVal })
    }

    setSliderVal7(newVal) {
        this.setState({ 'sliderVal7': newVal })
    }

    setSliderVal8(newVal) {
        this.setState({ 'sliderVal8': newVal })
    }

    async createViz() {
        let div = d3.select('#viz');
        let data = await d3.csv(fullDataFile);
        let data2 = await d3.csv(fullDataFileSP);

        this.setState({ fullData: data });
        this.setState({ fallData: data });
        this.setState({ springData: data2 });

        let profs = [];

        this.toggleTableInfo();
        this.plotClassInfo(false);
    }

    toggleTableInfo(e) {
        let newFields = this.state.toggle ? this.state.oldFieldsShown : Object.keys(this.fieldMapping);
        this.setState({ oldFieldsShown: this.state.fieldsShown })
        this.setState({ fieldsShown: newFields }, this.plotClassInfo);
        this.setState({ toggle: !this.state.toggle });
    }

    // initializePlots() {



    //     let svg = d3.select("#class-plots")
    //                 .selectAll('svg')
    //                 .data([1])
    //                 .join('svg')
    //                 .attr("width", width + margin.left + margin.right)
    //                 .attr("height", height + margin.top + margin.bottom)
    //                 .append("g")
    //                 .attr("transform",
    //                       "translate(" + margin.left + "," + margin.top + ")");

    // }



    generatePlots(classData, change) {

        let margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let div = d3.select("#class-plots")

        div.selectAll("*").remove()
        if (this.state.checked) {
            let svg = div.selectAll('svg')
                .data([1])
                .join('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")
                .attr("fill", "#302d86");

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + 40)
                .text("Grade Distribution (%)")

            let medianDict = { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0 }

            let totalEntries = classData.filter(class_ => this.allGrades.includes(class_['Median Grade'])).length
            this.allGrades.forEach(grade => {
                medianDict[grade] = classData.filter(class_ => class_['Median Grade'] === grade).length * 100 / totalEntries
            })

            let medianData = [];
            this.allGrades.forEach(grade => {
                medianData.push({ 'Grade': grade, 'Percent': medianDict[grade] })
            })

            // X axis
            var x = d3.scaleBand()
                .range([0, width])
                .domain(this.allGrades)
                .padding(0.2);

            svg.selectAll("g")
                .data([1])
                .join('g')
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // Bars
            svg.selectAll("rect")
                .data(medianData)
                .join("rect")
                .attr("x", function (d) { return x(d['Grade']); })
                .attr("y", function (d) { return y(d['Percent']); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d['Percent']); })
                .attr("fill", "#302d86")
        }

    }

    plotClassInfo(change = false) {

        this.setState({ loading: true });
        let class_data = this.updateSearch()
        this.generatePlots(class_data, change);
        let list = d3.select('#class-info');

        let colors = ['#e1e0f6', '#bebbf7']

        // Update Table
        let tableBody = d3.select('#class-info-table tbody');
        let tableHeader = d3.select('#class-info-header');
        let tableRows = tableBody.selectAll('tr')
            .data(class_data)
            .join('tr')
            .style('background-color', d => colors[class_data.indexOf(d) % 2])
            .style('border-radius', '10px')

        let fields = this.state.fieldsShown;

        let tableRowEntries = tableRows.selectAll('td')
            .data((d) => {
                let temp = [];
                fields.forEach(ele => temp.push(d[ele]))
                return temp;

            })
            .join('td')
            .text(d => d)

        tableRows.selectAll('td.table-button')
            .data(d => [d])
            .attr('class', 'table-button')
            .join('td')
            .append('input')
            .attr('type', 'checkbox')
            .on('change', d => {
                let course = d.srcElement.__data__

                let savedData = {
                    'Department': course['Dept'],
                    'Course Number': course['Num'],
                    'Course Name': course['Course_Name'],
                    'Professor': course['Professor'],
                    'Median Grade': course['Median Grade'],
                    'Class Rating': course['CU_Reviews_Rating'],
                    'Class Difficulty': course['CU_Reviews_Difficulty'],
                    'Class Workload': course['CU_Reviews_Workload'],
                    'Professor Difficulty': course['Difficulty'],
                    'Start Time': course['Start_Time'],
                    'End Time': course['End_Time']
                }

                let currentCourses = this.state.savedClasses
                if (currentCourses.includes(savedData)) {
                    // remove the class
                    currentCourses.splice(currentCourses.indexOf(savedData), 1)
                } else {
                    // add the class
                    currentCourses.push(savedData)
                }

                this.setState({ savedClasses: currentCourses })
            })

        d3.select('#class-info-header-row').selectAll('th')
            .data(fields.map(d => this.fieldMapping[d]).concat(['Add Class']))
            .join('th')
            .text(d => d)

        this.setState({ loading: false });
    }

    updateSemester() {
        // let semester = d3.select('#sem').property('value');
        let itm = document.getElementById("semester-dropdown");
        let semester = itm.options[itm.selectedIndex].text;

        if (semester === "FA '22") {
            this.setState({ fullData: this.state.fallData, semesterText: "FA '22" }, this.plotClassInfo);
        } else if (semester === "SP '22") {
            this.setState({ fullData: this.state.springData, semesterText: "SP '22" }, this.plotClassInfo);
        }

        // this.plotClassInfo();
    }

    updateSortBy() {
        let itm = document.getElementById("sortby-dropdown");
        let sortmethod = itm.options[itm.selectedIndex].text;
        this.setState({ sortMethod: sortmethod, sortByText: sortmethod }, this.plotClassInfo);
    }

    updateSearch() {

        let classes = this.state.fullData;
        let fields = ['Dept', 'Number', 'Course_Name', 'Professor'];

        let department = d3.select('#department-text').property('value');
        if (department !== '') {
            classes = classes.filter(class_ => class_['Dept'].toLowerCase().includes(department.toLowerCase()));
        }
        let prof = d3.select('#prof-text').property('value');
        if (prof !== '') {
            classes = classes.filter(class_ => class_['Professor'].toLowerCase().includes(prof.toLowerCase()));
        }

        let courseNum = Number(d3.select('#course-num-text').property('value'));
        if (courseNum !== 0) {
            classes = classes.filter(class_ => Number(class_['Number']) === courseNum);
        }

        let courseName = d3.select('#course-name-text').property('value');
        if (courseName !== '') {
            // classes = classes.filter(class_ => class_['Course_Name'].toLowerCase().includes(courseName.toLowerCase()));
            let newClasses = []

            classes.forEach(class_ => {
                let words = courseName.split(' ');
                let temp = true;
                words.forEach(word => {
                    if (!class_['Course_Name'].toLowerCase().includes(word.toLowerCase())) temp = false;
                })
                if (temp) newClasses.push(class_)
            });
            classes = newClasses;
        }

        let startTime = d3.select('#start-time-text').property('value');
        if (startTime !== '') {
            classes = classes.filter(class_ => class_['Start_Time'].includes(startTime));
            fields.push('Start_Time')
        }

        let endTime = d3.select('#end-time-text').property('value');
        if (endTime !== '') {
            classes = classes.filter(class_ => class_['End_Time'].includes(endTime));
            fields.push('End_Time')
        }

        let profDifSlider = d3.select('#prof-diff-slider')
        let val1 = this.state.sliderVal1;
        let val2 = this.state.sliderVal2;
        if (!(val1 === 1 && val2 === 5)) {
            classes = classes.filter(class_ => class_['Difficulty'] !== "" && (Number(class_['Difficulty']) <= val2 && Number(class_['Difficulty']) >= val1));
            fields.push('Difficulty')
        }

        let classDifSlider = d3.select('#class-diff-slider')
        let val3 = this.state.sliderVal3;
        let val4 = this.state.sliderVal4;
        if (!(val3 === 1 && val4 === 5)) {
            classes = classes.filter(class_ => class_['CU_Reviews_Difficulty'] !== "" && (Number(class_['CU_Reviews_Difficulty']) <= val4 && Number(class_['CU_Reviews_Difficulty']) >= val3));
            fields.push('CU_Reviews_Difficulty')
        }

        let classRate = d3.select('#class-rat-slider')
        let val5 = this.state.sliderVal5;
        let val6 = this.state.sliderVal6;
        if (!(val5 === 1 && val6 === 5)) {
            classes = classes.filter(class_ => class_['CU_Reviews_Rating'] !== "" && (Number(class_['CU_Reviews_Rating']) >= val5 && (Number(class_['CU_Reviews_Rating']) <= val6)));
            fields.push('CU_Reviews_Rating')
        }

        let classWork = d3.select('#class-work-slider')
        let val7 = this.state.sliderVal7;
        let val8 = this.state.sliderVal8;
        if (!(val7 === 1 && val8 === 5)) {
            classes = classes.filter(class_ => class_['CU_Reviews_Workload'] !== "" && (Number(class_['CU_Reviews_Workload']) <= val8 && (Number(class_['CU_Reviews_Workload']) >= val7)));
            fields.push('CU_Reviews_Workload')
        }

        let medianGrades = this.state.medianGrades;
        if (medianGrades.length !== 0 && medianGrades.length !== 6) {
            classes = classes.filter(class_ => medianGrades.includes(class_['Median Grade']));
            fields.push('Median Grade')
        }

        // Update the fields shown
        let all_fields = ['Dept', 'Number', 'Course_Name', 'Professor', 'Median Grade', 'CU_Reviews_Rating', 'CU_Reviews_Difficulty', 'CU_Reviews_Workload', 'Difficulty', 'Start_Time', 'End_Time'];
        this.setState({ fieldsShown: all_fields });

        classes.sort((d1, d2) => {
            if (this.state.sortMethod === "Course Number") {
                return Number(d1['Number']) - Number(d2['Number']);
            } else if (this.state.sortMethod === "dept") {
                return d1['Dept'].localeCompare(d2['Dept'])
            } else if (this.state.sortMethod == "Rating") {
                let d1w = d1['CU_Reviews_Rating'];
                let d2w = d2['CU_Reviews_Rating'];
                if (d1w !== "" && d2w !== "") {
                    return Number(d1w) - Number(d2w);
                } else if (d1w !== "") {
                    return -1
                } else if (d2w !== "") {
                    return 1
                } else {
                    return 0
                }
            } else if (this.state.sortMethod === "Class Difficulty") {
                let d1w = d1['CU_Reviews_Difficulty'];
                let d2w = d2['CU_Reviews_Difficulty'];
                if (d1w !== "" && d2w !== "") {
                    return Number(d1w) - Number(d2w);
                } else if (d1w !== "") {
                    return -1
                } else if (d2w !== "") {
                    return 1
                } else {
                    return 0
                }
            } else if (this.state.sortMethod === "Workload") {
                let d1w = d1['CU_Reviews_Workload'];
                let d2w = d2['CU_Reviews_Workload'];
                if (d1w !== "" && d2w !== "") {
                    return Number(d1w) - Number(d2w);
                } else if (d1w !== "") {
                    return -1
                } else if (d2w !== "") {
                    return 1
                } else {
                    return 0
                }
            } else if (this.state.sortMethod === "Prof Difficulty") {
                let d1w = d1['Difficulty'];
                let d2w = d2['Difficulty'];
                if (d1w !== "" && d2w !== "") {
                    return Number(d1w) - Number(d2w);
                } else if (d1w !== "") {
                    return -1
                } else if (d2w !== "") {
                    return 1
                } else {
                    return 0
                }
            } else if (this.state.sortMethod === "Median Grade") {
                let d1w = d1['Median Grade'];
                let d2w = d2['Median Grade'];
                if (d1w !== "" && d2w !== "") {
                    return this.medGradeMapping[d2w] - this.medGradeMapping[d1w]
                } else if (d1w !== "") {
                    return -1
                } else if (d2w !== "") {
                    return 1
                } else {
                    return 0
                }

            }
        });
        return classes
    }

    updateMedianGrade(e) {
        // list of all grades at the selected and above
        if (e.target.value === "Any") {
            this.setState({ medianGrades: this.allGrades }, this.plotClassInfo);
        } else {
            this.setState({ medianGrades: this.allGrades.slice(this.allGrades.indexOf(e.target.value)) }, this.plotClassInfo);
        }
        //this.plotClassInfo();
    }

    componentDidMount() {
        this.createViz();
        d3.selectAll('.text-input').on('change', this.plotClassInfo)
        d3.selectAll('.slider').on('change', this.plotClassInfo)
    }

    componentDidUpdate() {
        //this.plotClassInfo() // causes infinite loop
    }

    render() {
        let list;


        return (
            <div className="Home-Page App">
                <br />
                {/* <h1 class="centered">Cornell EZ-A</h1> */}
                <div class="toprow">
                    <div class="leftcol">
                        <img src={CDSLogo} alt="cds logo" class="logo"></img>
                    </div>
                    <div >
                        <img id="eza" src={EZALogo} alt="Cornell EZ-A"></img>
                    </div>
                </div>
                <div class="row">

                </div>
                <div class="extra3">
                    <div class="row text-row">
                        <div class="col">
                            <div>
                                <label for="check-1" class="box-label">Department</label>
                                <input class="text-input" id='department-text' type="text" placeholder="CS"></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col ">
                            <div>
                                <label for="check-5" class="box-label">Course Name</label>
                                <input class="text-input" id='course-name-text' type="text" placeholder="Intro to Python"></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col rightcol">
                            <div>
                                <label for="check-10" class="box-label">Start Time</label>
                                <input class="text-input" id='start-time-text' type="text" placeholder="9:05"></input>
                            </div>
                        </div>

                    </div>

                    <div class="row text-row">

                        <div class="col">
                            <div>
                                <label for="check-2" class="box-label">Professor</label>
                                <input class="text-input" id='prof-text' type="text" placeholder="Walker White"></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col ">
                            <label for="check-4" class="box-label">Course Number</label>
                            <input class="text-input" id='course-num-text' type="text" placeholder="4998"></input>
                            <br></br>
                        </div>



                        <div class="col rightcol">
                            <div>
                                <label for="check-11" class="box-label">End Time</label>
                                <input class="text-input" id='end-time-text' type="text" placeholder="9:55"></input>
                            </div>
                        </div>
                    </div>
                </div>



                <div class="row my-0 extra">
                    <hr />
                    <div class="col my-0">
                        <div>
                            {/* <div class="subrow"> */}
                            <div class="col extra-padding">
                                <label for="check-6" >Professor Difficulty</label>
                            </div>
                            <div class="col">
                                <BasicSlider id="prof-diff-slider" class="slider" changeFunc={this.plotClassInfo} updateVal1={this.setSliderVal1} updateVal2={this.setSliderVal2} minimum={1} maximum={5} time={false} ></BasicSlider>
                            </div>
                        </div>
                        <br></br>
                        {/* </div> */}
                    </div>

                    <div class="col my-0">
                        <div>
                            <div class="subrow">
                                <div class="col extra-padding rightcol">
                                    <label for="check-7">Class Difficulty</label>
                                </div>
                                <div class="col rightcol">
                                    <BasicSlider id="class-diff-slider" class="slider" changeFunc={this.plotClassInfo} updateVal1={this.setSliderVal3} updateVal2={this.setSliderVal4} minimum={1} maximum={5} time={false} ></BasicSlider>
                                </div>
                            </div>
                            <br></br>
                        </div>
                    </div>
                </div>

                <div class="row slider">
                    <div class="col my-0 extra3">
                        <div>
                            <div class="subrow">
                                <div class="col extra-padding">
                                    <label for="check-8">Class Rating</label>
                                </div>
                                <div class="col">
                                    <BasicSlider id="class-rat-slider" changeFunc={this.plotClassInfo} updateVal1={this.setSliderVal5} updateVal2={this.setSliderVal6} minimum={1} maximum={5} time={false} ></BasicSlider>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col my-0 extra3">
                        <div>
                            <div class="subrow">
                                <div class="col extra-padding rightcol">
                                    <label for="check-9">Class Workload</label>
                                </div>
                                <div class="col rightcol">
                                    <BasicSlider id="class-work-slider" changeFunc={this.plotClassInfo} updateVal1={this.setSliderVal7} updateVal2={this.setSliderVal8} minimum={1} maximum={5} time={false} ></BasicSlider>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col">
                        <div class="centered disclaimer">
                            <p>From <a href="https://www.ratemyprofessors.com">ratemyprofessors.com</a> and <a href="https://www.cureviews.org/">cureviews.org</a></p>
                        </div>
                    </div>
                </div>
                <div class="extra4">
                    <hr />

                    <div class="row">
                        <label class="med-grade-text" id="centered">Median Grade</label>
                    </div>
                    <div class="row dropdown-menus">

                        <div class="col">
                            <label>Semester</label>
                            <br></br>
                            <select id="semester-dropdown" title={this.state.semesterText} onChange={this.updateSemester}>
                                <option value="FA '22">FA '22</option>
                                <option value="SP '22">SP '22</option>
                            </select>
                        </div>

                        <div class="col">
                            <ButtonToolbar className="justify-content-center" aria-label="Toolbar with Button groups">
                                <ButtonGroup aria-label="First group" onClick={this.updateMedianGrade}>
                                    <Button variant="secondary" value="Any">Any</Button>{' '}
                                    <Button variant="secondary" value="A+">A+</Button>{' '}
                                    <Button variant="secondary" value="A">A</Button>{' '}
                                    <Button variant="secondary" value="A-">A-</Button>{' '}
                                    <Button variant="secondary" value="B+">B+</Button>{' '}
                                    <Button variant="secondary" value="B">B</Button>{' '}
                                    <Button variant="secondary" value="B-">B-</Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                            <br />
                            <div class="centered disclaimer">
                                <i>Disclaimer: We scraped median grade data from student generated spreadsheets.</i>
                            </div>
                        </div>
                        <div class="col rightcol">
                            <label>Sort by</label>
                            <br></br>

                            <select id="sortby-dropdown" title={this.state.sortByText} onChange={this.updateSortBy}>
                                <option value="Department">Department</option>
                                <option value="Course Number">Course Number</option>
                                <option value="Rating">Rating</option>
                                <option value="Workload">Workload</option>
                                <option value="Class Difficulty">Class Difficulty</option>
                                <option value="Prof Difficulty">Prof Difficulty</option>
                                <option value="Median Grade">Median Grade</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div id="CSVLink" class="col">
                            <CSVLink data={this.state.savedClasses} id="export-button" headers={this.state.headers} filename={'Saved_Classes.csv'}>Export to CSV</CSVLink>
                        </div>

                        <div class="col rightcol">
                            {/* <Button type="checkbox" onClick={() => {
                                this.setState({ showPlots: !showPlots }, this.plotClassInfo(this.state.showPlots));

                            }}>Toggle Median Grade Plot</Button> */}
                            <label>
                                <span id="show">Show graphs</span>
                                <Switch id="myswitch" onChange={this.handleChange} checked={this.state.checked} />
                            </label>
                        </div>
                    </div>
                </div>
                <div class="extra5">

                    <hr />
                    <div class="centered">
                        {/* { this.state.loading && <iframe src="https://giphy.com/embed/3oEjI6SIIHBdRxXI40" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe> } */}
                        {this.state.loading && <img id="loading" src={loadingGIF} alt="loading"></img>}
                    </div>


                    <div id="class-plots" class="centered"></div>
                    <div style={{ align: "center" }}>
                        <table id="class-info-table">
                            <thead id="class-info-header">
                                <tr id="class-info-header-row"></tr>
                            </thead>
                            <tbody></tbody>
                        </table>

                        {list}

                    </div>
                </div>
            </div>
        )
    }
}
