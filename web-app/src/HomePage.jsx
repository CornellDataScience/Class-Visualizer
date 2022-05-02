import React, { Component } from 'react';
import * as d3 from 'd3';
import fullDataFileSP from './data/FullerData_CUReviews.csv';
import fullDataFile from './data/FullerData_CUReviews_FA22.csv';
import { BasicSlider } from './BasicSlider.jsx';
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';

// Department: Dept
// Professor: Professor_x
// Course Number: Number
// Course Name: Course_Name
// Start Time: Start_Time
// End Time: End_Time
// Professor Difficulty: Difficulty
// Class Difficulty: CU_Reviews_Difficulty
// Class Rating: CU_Reviews_Rating
// Class Workload: CU_Reviews_Workload
// Median Grade: Median Grade


export default class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            fullData: [],
            fallData: [],
            springData: [],
            selectedClasses: ['Dept + Number', 'Course_Name', 'Professor_x'],
            sliderVal1: 0,
            sliderVal2: 0,
            sliderVal3: 0,
            sliderVal4: 0,
            sliderVal5: 0,
            sliderVal6: 0,
            sliderVal7: 0,
            sliderVal8: 0,
            medianGrades: [],
            fieldsShown: ['Dept', 'Number', 'Course_Name', 'Professor_x', 'Median Grade', 'CU_Reviews_Rating', 'CU_Reviews_Difficulty', 'CU_Reviews_Workload', 'Difficulty', 'Start_Time', 'End_Time'],
            oldFieldsShown: [],
            toggle: false
        };

        this.allGrades = ['B-', 'B', 'B+', 'A-', 'A', 'A+'];
        this.fieldMapping = {
            'Dept': 'Department',
            'Professor_x': 'Professor',
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

        this.createViz = this.createViz.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.updateSemester = this.updateSemester.bind(this);
        this.plotClassInfo = this.plotClassInfo.bind(this);
        this.updateMedianGrade = this.updateMedianGrade.bind(this);
        this.toggleTableInfo = this.toggleTableInfo.bind(this);

        this.setSliderVal1 = this.setSliderVal1.bind(this);
        this.setSliderVal2 = this.setSliderVal2.bind(this);
        this.setSliderVal3 = this.setSliderVal3.bind(this)
        this.setSliderVal4 = this.setSliderVal4.bind(this)
        this.setSliderVal5 = this.setSliderVal5.bind(this)
        this.setSliderVal6 = this.setSliderVal6.bind(this)
        this.setSliderVal7 = this.setSliderVal7.bind(this)
        this.setSliderVal8 = this.setSliderVal8.bind(this)
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
        this.plotClassInfo();
    }

    toggleTableInfo(e) {


        let newFields = this.state.toggle ? this.state.oldFieldsShown : Object.keys(this.fieldMapping);
        this.setState({ oldFieldsShown: this.state.fieldsShown })
        this.setState({ fieldsShown: newFields }, this.plotClassInfo);
        this.setState({ toggle: !this.state.toggle });
    }

    plotClassInfo() {
        let class_data = this.updateSearch()

        let svg = d3.select("#class-info-plot")
            .append('svg')
            .attr('height', 500)
            .attr('width', 1000)

        let list = d3.select('#class-info');

        // Update Table
        let tableBody = d3.select('#class-info-table tbody');
        let tableHeader = d3.select('#class-info-header');
        let tableRows = tableBody.selectAll('tr')
            .data(class_data)
            .join('tr')

        let fields = this.state.fieldsShown;

        let tableRowEntries = tableRows.selectAll('td')
            .data((d) => {
                let temp = [];
                fields.forEach(ele => temp.push(d[ele]))
                //return [d['Dept + Number'], d['Course_Name'], d['Professor_x'], d['Median Grade']]
                return temp;

            })
            .join('td')
            .text(d => d)

        d3.select('#class-info-header-row').selectAll('th')
            //.data(['Course', 'Name', 'Professor', 'Median'])
            .data(fields.map(d => this.fieldMapping[d]))
            .join('th')
            .text(d => d)

    }

    updateSemester(semester) {
        // let semester = d3.select('#sem').property('value');

        if (semester === "FA22") {
            this.setState({ fullData: this.state.fallData });
        } else if (semester === "SP22") {
            this.setState({ fullData: this.state.springData });
        }

        this.plotClassInfo()
    }

    updateSearch() {

        let classes = this.state.fullData;
        let fields = ['Dept', 'Number', 'Course_Name', 'Professor_x'];

        let department = d3.select('#department-text').property('value');
        if (department !== '') {
            classes = classes.filter(class_ => class_['Dept'].toLowerCase().includes(department.toLowerCase()));
        }
        let prof = d3.select('#prof-text').property('value');
        if (prof !== '') {
            classes = classes.filter(class_ => class_['Professor_x'].toLowerCase().includes(prof.toLowerCase()));
        }

        let courseNum = Number(d3.select('#course-num-text').property('value'));
        if (courseNum !== 0) {
            classes = classes.filter(class_ => Number(class_['Number']) === courseNum);
        }

        let courseName = d3.select('#course-name-text').property('value');
        if (courseName !== '') {
            classes = classes.filter(class_ => class_['Course_Name'].toLowerCase().includes(courseName.toLowerCase()));
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
        let all_fields = ['Dept', 'Number', 'Course_Name', 'Professor_x', 'Median Grade', 'CU_Reviews_Rating', 'CU_Reviews_Difficulty', 'CU_Reviews_Workload', 'Difficulty', 'Start_Time', 'End_Time'];
        this.setState({ fieldsShown: all_fields });

        classes.sort((d1, d2) => {
            return Number(d1['Number']) - Number(d2['Number']);
        });

        return classes
    }

    updateMedianGrade(e) {
        // list of all grades at the selected and above
        if (e.target.value == "Any") {
            this.setState({ medianGrades: this.allGrades });
        } else {
            this.setState({ medianGrades: this.allGrades.slice(this.allGrades.indexOf(e.target.value)) });
        }
        this.plotClassInfo();
    }

    componentDidMount() {
        this.createViz();
        d3.selectAll('.text-input').on('change', this.plotClassInfo)
        d3.selectAll('.slider').on('change', this.plotClassInfo)





        // d3.select('#sem').on('change', () => {
        //     console.log(d3.select('#sem').property('value'))
        // })
    }

    componentDidUpdate() {
        //this.plotClassInfo() // causes infinite loop
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
                <br />
                <h1 class="centered">Class Visualizer</h1>

                <div>
                    <div class="row">
                        <div class="col">
                            <div>
                                <label for="check-1" class="box-label">Department</label>
                                <input class="text-input" id='department-text' type="text" placeholder="Enter Dept..."></input>
                                <br></br>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                <label for="check-2" class="box-label">Professor</label>
                                <input class="text-input" id='prof-text' type="text" placeholder="Enter Prof Name..."></input>
                                <br></br>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <label for="check-4" class="box-label">Course Number</label>
                            <input class="text-input" id='course-num-text' type="text" placeholder="Enter Course No."></input>
                            <br></br>
                        </div>

                        <div class="col">
                            <div>
                                <label for="check-5" class="box-label">Course Name</label>
                                <input class="text-input" id='course-name-text' type="text" placeholder="Enter Course Name..."></input>
                                <br></br>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div>
                                <label for="check-10" class="box-label">Start Time</label>
                                <input class="text-input" id='start-time-text' type="text" placeholder="Enter start time..."></input>
                            </div>
                        </div>

                        <div class="col">
                            <div>
                                <label for="check-11" class="box-label">End Time</label>
                                <input class="text-input" id='end-time-text' type="text" placeholder="Enter end time..."></input>
                            </div>
                        </div>
                    </div>

                    <div class="row my-0">
                        <div class="col my-0">
                            <div>
                                <label for="check-6" >Professor Difficulty</label>
                                <BasicSlider id="prof-diff-slider" class="slider" updateVal1={this.setSliderVal1} updateVal2={this.setSliderVal2} minimum={1} maximum={5} time={false} ></BasicSlider>
                                <br></br>
                            </div>
                        </div>

                        <div class="col my-0">
                            <div>
                                <label for="check-7">Class Difficulty</label>
                                <BasicSlider id="class-diff-slider" class="slider" updateVal1={this.setSliderVal3} updateVal2={this.setSliderVal4} minimum={1} maximum={5} time={false} ></BasicSlider>
                                <br></br>
                            </div>
                        </div>
                    </div>

                    <div class="row my-0">
                        <div class="col my-0">
                            <div>
                                <label for="check-8">Class Rating</label>
                                <BasicSlider id="class-rat-slider" class="slider" updateVal1={this.setSliderVal5} updateVal2={this.setSliderVal6} minimum={1} maximum={5} time={false} ></BasicSlider>
                            </div>
                        </div>

                        <div class="col my-0">
                            <div>
                                <label for="check-9">Class Workload</label>
                                <BasicSlider id="class-work-slider" class="slider" updateVal1={this.setSliderVal7} updateVal2={this.setSliderVal8} minimum={1} maximum={5} time={false} ></BasicSlider>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <label class="med-grade-text" id="centered">Median Grade</label>
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
                        </div>
                    </div>

                    {/* <div class="row">
                        <div class="col">
                            <label class="toggle-all-text">Toggle Information Displayed</label>
                            <br></br>
                            <ButtonGroup aria-label="Second group" onClick={this.toggleTableInfo}>
                                <Button variant="secondary" value="Toggle">Toggle</Button>
                            </ButtonGroup>
                        </div>
                    </div> */}

                    <div class="row">
                        <div id="centered" class="col">

                            <DropdownButton id="semester-dropdown" title="Semester" onSelect={this.updateSemester}>
                                <Dropdown.Item eventKey="FA22">FA '22</Dropdown.Item>
                                <Dropdown.Item eventKey="SP22">SP '22</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </div>

                <br />

                <div id="selected-class-info"></div>
                <div style={{ align: "center" }}>
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