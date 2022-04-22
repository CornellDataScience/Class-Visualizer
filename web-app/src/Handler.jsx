export function Handle({
  handle: { id, value, percent },
  time,
  getHandleProps
}) {
  let timeDict = {
    1: '9:05',
    2: '9:55',
    3: '10:10',
    4: '11:00',
    5: '12:20'
  };

  console.log('Time', time)

  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#2C4870',
        color: '#333',
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: 'Roboto', fontSize: 20, marginTop: -30 }}>
        {time ? timeDict[value] : value}
      </div>
    </div>
  )
}