import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
} from 'react-native-responsive-linechart';
import {SafeAreaView, View} from 'react-native';

const ChartView = ({data}) => {
  return (
    <View
      style={{alignItems: 'center', color: '#fff', backgroundColor: '#fff'}}>
      <Chart
        style={{height: 280, width: 400}}
        data={data}
        padding={{left: 40, bottom: 20, right: 20, top: 20}}
        xDomain={{min: 0, max: 50000}}
        yDomain={{min: -1, max: 1}}>
        <VerticalAxis
          tickCount={11}
          theme={{labels: {formatter: v => v.toFixed(2), color: '#fff'}}}
        />
        <HorizontalAxis
          tickCount={5}
          theme={{labels: {formatter: v => v.toFixed(2), color: '#fff'}}}
        />
        {/* <Area
          theme={{
            gradient: {
              from: {color: '#ffa502'},
              to: {color: '#ffa502', opacity: 0.4},
            },
          }}
        />
        <Line
          theme={{
            stroke: {color: '#ffa502', width: 5},
            scatter: {default: {width: 4, height: 4, rx: 2}},
          }}
        /> */}
        <Line theme={{stroke: {color: '#2ecc71', width: 1}}} />
        {/* <Area
          theme={{
            gradient: {from: '#2ecc71', to: '#2ecc71', direction: 'vertical'},
          }}
        /> */}
      </Chart>
    </View>
  );
};
export default ChartView;
