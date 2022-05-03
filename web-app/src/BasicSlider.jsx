import { Slider, Handles } from 'react-compound-slider'
import { Handle } from './Handler.jsx'
import { useState, useEffect } from 'react';

export const BasicSlider = (props) => {

  const sliderStyle = {  // Give the slider some width
    position: 'relative',
    width: '200%',
    height: 80,
    //border: '1px solid steelblue',
    left: '100px'
  }

  const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: 35,
    borderRadius: 3,
    backgroundColor: '#8B9CB6',
  }


  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);

  useEffect(() => {
    props.updateVal1(value)

  }, [value]);

  useEffect(() => {
    props.updateVal2(value2)

  }, [value2]);


  return (
    <div>
      <Slider
        rootStyle={sliderStyle}
        domain={[props.minimum, props.maximum]}
        step={1}
        mode={2}
        values={[props.minimum, props.maximum]}
      >
        <div style={railStyle} />
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">

              <Handle
                key={handles[0].id}
                handle={handles[0]}
                time={props.time}
                getHandleProps={getHandleProps}
                updateVal={setValue}
              />

              <Handle
                key={handles[1].id}
                handle={handles[1]}
                time={props.time}
                getHandleProps={getHandleProps}
                updateVal={setValue2}
              />

              {/* {handles.map(handle => (
                
                <Handle
                  key={handle.id}
                  handle={handle}
                  time={props.time}
                  getHandleProps={getHandleProps}
                  updateVal={setValue}
                />
              ))} */}
            </div>
          )}
        </Handles>
      </Slider>
    </div>
  )

}