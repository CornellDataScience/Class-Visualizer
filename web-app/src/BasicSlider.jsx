import { Slider, Handles } from 'react-compound-slider'
import { Handle } from './Handler.jsx'

export const BasicSlider = (props) => {

  const sliderStyle = {  // Give the slider some width
    position: 'relative',
    width: '10%',
    height: 80,
    //border: '1px solid steelblue',
    left: '400px'
  }

  const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: 35,
    borderRadius: 3,
    backgroundColor: '#8B9CB6',
  }

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
              {handles.map(handle => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  time={props.time}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
      </Slider>
    </div>
  )

}