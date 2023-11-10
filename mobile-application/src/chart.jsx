import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Label,
  Tooltip,
} from 'react-native-responsive-linechart';
import {SafeAreaView, Text, View} from 'react-native';

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
          theme={{
            labels: {formatter: v => v.toFixed(2), color: '#fff'},
          }}></VerticalAxis>
        <HorizontalAxis
          tickCount={5}
          theme={{
            labels: {formatter: v => (v / 1000).toFixed(2), color: '#fff'},
          }}
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
        <Line
          tooltipComponent={<Tooltip />}
          theme={{stroke: {color: '#7B1FA2', width: 1.5}}}
        />
        {/* <Area
          theme={{
            gradient: {from: '#2ecc71', to: '#2ecc71', direction: 'vertical'},
          }}
        /> */}
      </Chart>
      <Text style={{color: '#000'}}>sin(angle) VS time(s)</Text>
    </View>
  );
};
export default ChartView;
