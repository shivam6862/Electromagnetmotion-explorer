import {useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from 'react-native';

import Toast from '@remobile/react-native-toast';
import BluetoothSerial from 'react-native-bluetooth-serial';
import ChartView from './chart';
import {Buffer} from 'buffer';
global.Buffer = Buffer;
const iconv = require('iconv-lite');

const activeTabStyle = {borderBottomWidth: 6, borderColor: '#009688'};

const Button = ({title, onPress, style, textStyle}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title.toUpperCase()}</Text>
  </TouchableOpacity>
);

const DeviceList = ({
  devices,
  connectedId,
  showConnectedIcon,
  onDevicePress,
  isConnected,
}) => (
  <ScrollView style={styles.container}>
    <View style={styles.listContainer}>
      {devices.map((device, i) => {
        return (
          <TouchableHighlight
            underlayColor="#DDDDDD"
            key={`${device.id}_${i}`}
            style={styles.listItem}
            onPress={() => onDevicePress(device)}>
            <View style={{flexDirection: 'row'}}>
              {showConnectedIcon ? (
                <View style={{width: 48, height: 48, opacity: 0.4}}>
                  {connectedId === device.id && isConnected ? (
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: 24,
                        height: 24,
                        flex: 1,
                      }}
                      source={require('./images/ic_done_black_24dp.png')}
                    />
                  ) : null}
                </View>
              ) : null}
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', color: '#000'}}>
                  {device.name}
                </Text>
                <Text style={{color: '#000'}}>{`<${device.id}>`}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  </ScrollView>
);

let interval;
function BluetoothSerialExample() {
  const [state, setState] = useState({
    isEnabled: false,
    discovering: false,
    devices: [],
    unpairedDevices: [],
    connected: false,
    section: 0,
    device: {},
    recievedData: [],
    isSubscribed: false,
  });
  const [chartDataState, setChartDataState] = useState([
    {x: -2, y: 15},
    {x: -1, y: 10},
    {x: 0, y: 12},
    {x: 1, y: 7},
    {x: 2, y: 6},
    {x: 3, y: 8},
    {x: 4, y: 10},
    {x: 5, y: 8},
    {x: 6, y: 12},
    {x: 7, y: 14},
    {x: 8, y: 12},
    {x: 9, y: 13.5},
    {x: 10, y: 18},
  ]);

  useEffect(() => {
    (async () => {
      try {
        const grantedConnect = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        if (grantedConnect === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('connection allowed');
        } else {
          console.log('connection disallowed');
        }

        const grantedScan = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        if (grantedScan === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('scanning allowed');
        } else {
          console.log('scanning disallowed');
        }
      } catch (err) {
        console.warn(err);
      }

      const values = await Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list(),
      ]);

      const [isEnabled, devices] = values;
      setState(state => {
        return {...state, isEnabled, devices};
      });
    })();
    (async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Your application needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    })();

    BluetoothSerial.on('bluetoothEnabled', async () => {
      Toast.showShortBottom('Bluetooth enabled');
      const devices = await BluetoothSerial.list();
      setState(state => {
        return {...state, isEnabled: true, devices};
      });
    });

    BluetoothSerial.on('bluetoothDisabled', () => {
      Toast.showShortBottom('Bluetooth disabled');
      setState(state => {
        return {...state, isEnabled: false, devices: []};
      });
    });
    BluetoothSerial.on('read', data => {
      setState(state => {
        return {...state, recievedData: data};
      });
      console.log(`Received data from device using read: ${data}`);
    });
    console.log(BluetoothSerial);

    BluetoothSerial.on('error', err => console.log(`Error: ${err.message}`));
  }, []);

  useEffect(() => {
    function run() {
      if (Object.keys(state.device).length !== 0) {
        Toast.showShortBottom(
          `Connection to device ${state.device.name} has been lost`,
        );
      }

      setState(state => {
        return {...state, connected: false};
      });
    }

    // runs twice because event is triggered by eventlistener, but state.connected changes, so runs again
    BluetoothSerial.on('connectionLost', run);

    // return () => BluetoothSerial.removeListener('connectionLost', run);
  }, [state.connected]);

  /**
   * [android]
   * request enable of bluetooth from user
   */
  async function requestEnable() {
    try {
      await BluetoothSerial.requestEnable();
      setState(state => {
        return {...state, isEnabled: true};
      });
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  /**
   * [android]
   * enable bluetooth on device
   */
  async function enable() {
    try {
      await BluetoothSerial.enable();
      setState(state => {
        return {...state, isEnabled: true};
      });
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  /**
   * [android]
   * disable bluetooth on device
   */
  async function disable() {
    try {
      await BluetoothSerial.disable();
      setState(state => {
        return {...state, isEnabled: false};
      });
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  /**
   * [android]
   * toggle bluetooth
   */
  async function toggleBluetooth(value) {
    value ? await enable() : await disable();
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  async function discoverUnpaired() {
    if (state.discovering) return false;
    else {
      setState(state => {
        return {...state, discovering: true};
      });

      try {
        const result = await BluetoothSerial.discoverUnpairedDevices();
        setState(state => {
          return {...state, unpairedDevices: result, discovering: false};
        });
      } catch (err) {
        Toast.showShortBottom(err.message);
      }
    }
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  async function cancelDiscovery() {
    if (state.discovering) {
      try {
        await BluetoothSerial.cancelDiscovery();
        setState(state => {
          return {...state, discovering: false};
        });
      } catch (err) {
        Toast.showShortBottom(err.message);
      }
    }
  }

  /**
   * [android]
   * Pair device
   */
  async function pairDevice(device) {
    try {
      const result = await BluetoothSerial.pairDevice(device.id);

      if (result) {
        Toast.showShortBottom(`Device ${device.name} paired successfully`);
        setState(state => {
          const devices = state.devices;
          devices.push(device);
          return {
            ...state,
            devices,
            unpairedDevices: state.unpairedDevices.filter(
              d => d.id !== device.id,
            ),
          };
        });
      } else {
        Toast.showShortBottom(`Device ${device.name} pairing failed`);
      }
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  /**
   * Connect to bluetooth device by id
   * @param  {Object} device
   */
  async function connect(device) {
    if (state.connected) return;

    setState(state => {
      return {...state, connecting: true};
    });
    try {
      await BluetoothSerial.connect(device.id);
      Toast.showShortBottom(`Connected to device ${device.name}`);
      setState(state => {
        return {...state, connected: true, connecting: false, device};
      });
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  /**
   * Disconnect from bluetooth device
   */
  async function disconnect() {
    try {
      await BluetoothSerial.disconnect();

      setState(state => {
        return {...state, connected: false};
      });
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  /**
   * Toggle connection when we have active device
   * @param  {Boolean} value
   */
  async function toggleConnect(value) {
    value && state.device ? await connect(state.device) : await disconnect();
  }

  /**
   * Write message to device
   * @param  {String} message
   */
  async function write(message) {
    if (!state.connected) {
      Toast.showShortBottom('You must connect to device first');
      return;
    }

    try {
      await BluetoothSerial.write(message);
      Toast.showShortBottom(`Successfully wrote to device (${message})`);
      setState(state => {
        return {...state, connected: true};
      });
    } catch (err) {
      Toast.showShortBottom(err.message);
    }
  }

  async function onDevicePress(device) {
    state.section === 0 ? await connect(device) : await pairDevice(device);
  }

  async function writePackets(message, packetSize = 64) {
    const toWrite = iconv.encode(message, 'cp852');
    const writePromises = [];
    const packetCount = Math.ceil(toWrite.length / packetSize);

    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize);
      packet.fill(' ');
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
      writePromises.push(BluetoothSerial.write(packet));
    }

    await Promise.all(writePromises);
  }
  async function onSubscribe() {
    try {
      setState(state => {
        return {...state, isSubscribed: true};
      });
      await BluetoothSerial.subscribe('\n', data => {
        setState(state => {
          return {...state, recievedData: data};
        });
        console.log(`Received data: ${data}`);
      });
    } catch (err) {
      setState(state => {
        return {...state, isSubscribed: false};
      });
      console.log(err);
    }
  }
  async function readFromDevice() {
    const globalTimeInMilliseconds = new Date().getTime();
    // try {
    //   interval = setInterval(async () => {
    try {
      const message = await BluetoothSerial.readFromDevice();
      console.log(message);
      // setState(state => {
      //   return {...state, isSubscribed: true};
      // });
      // if (message.length > 0) {
      //   const values = message.split(',');
      //   const validAngles = [];
      //   const angleObjects = [];
      //   values.map((value, index) => {
      //     const floatValue = parseFloat(value);
      //     if (!isNaN(floatValue) && floatValue >= -90 && floatValue <= 90) {
      //       const decimalCount = value.split('.')[1]
      //         ? value.split('.')[1].length
      //         : 0;
      //       if (decimalCount === 2) {
      //         validAngles.push(floatValue);
      //         const currentTimeInMilliseconds = new Date().getTime();
      //         const currentTimestamp =
      //           currentTimeInMilliseconds - globalTimeInMilliseconds;
      //         if (
      //           angleObjects.length > 0 &&
      //           chartDataState.length > 0 &&
      //           angleObjects[angleObjects.length - 1].angle != floatValue &&
      //           chartDataState[chartDataState.length - 1].angle !=
      //             floatValue
      //         ) {
      //           angleObjects.push({
      //             angle: floatValue,
      //             timeInMillisec: currentTimestamp,
      //           });
      //         }
      //         if (angleObjects.length == 0) {
      //           angleObjects.push({
      //             angle: floatValue,
      //             timeInMillisec: currentTimestamp,
      //           });
      //         }
      //       }
      //     }
      //   });
      //   setChartDataState(prev => [...prev, ...angleObjects]);
      // }
    } catch (error) {
      console.log(error);
      // clearInterval(interval);
      // setState(state => {
      //   return {...state, isSubscribed: false};
      // });
    }
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    //   setState(state => {
    //     return {...state, isSubscribed: false};
    //   });
    // } finally {
    //   return () => {
    //     clearInterval(interval);
    //     setState(state => {
    //       return {...state, isSubscribed: false};
    //     });
    //   };
    // }
  }
  const handleReadCharacter = async () => {
    console.log('started recieving');
    setChartDataState([{x: 0, y: 0}]);
    try {
      interval = setInterval(async () => {
        try {
          const inputString = await BluetoothSerial.readFromDevice();
          setState(state => {
            return {...state, isSubscribed: true};
          });
          // console.log('message', inputString);
          if (inputString.length > 0) {
            let pairs = inputString.split('],');
            let arrayOfObjects = [];
            for (let i = 1; i < pairs.length - 1; i++) {
              let [angle, time] = pairs[i].split('[');
              let angleValue = parseFloat(angle);
              let timeInMillisec = parseInt(time);
              let obj = {
                x: timeInMillisec,
                y: Math.sin((angleValue * Math.PI) / 180),
              };
              arrayOfObjects.push(obj);
            }
            // setReadCharacter(response.message);
            setChartDataState(prev => [...prev, ...arrayOfObjects]);
          }
        } catch (error) {
          clearInterval(interval);
          // setIsReadButtonActive(true);
          setState(state => {
            return {...state, isSubscribed: false};
          });
        }
      }, 250);
    } catch (error) {
      console.log(error);
      // setIsReadButtonActive(true);
      setState(state => {
        return {...state, isSubscribed: false};
      });
    } finally {
      return () => {
        clearInterval(interval);
        // setIsReadButtonActive(true);
        setState(state => {
          return {...state, isSubscribed: false};
        });
      };
    }
  };
  function deleteInterval() {
    clearInterval(interval);
    setState(state => {
      return {...state, isSubscribed: false};
    });
  }
  async function onUnsubscribe() {
    try {
      await BluetoothSerial.unsubscribe(() => {
        setState(state => {
          return {...state, isSubscribed: false};
        });
        console.log('unsubscribed to device');
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <View style={{flex: 1}}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Electormagnet Motion Experiment</Text>
        {/* {Platform.OS === 'android' ? (
          <View style={styles.enableInfoWrapper}>
            <Text style={{fontSize: 12, color: '#FFFFFF'}}>
              {state.isEnabled ? 'disable' : 'enable'}
            </Text>
            <Switch onValueChange={toggleBluetooth} value={state.isEnabled} />
          </View>
        ) : null} */}
      </View>

      {Platform.OS === 'android' ? (
        <View
          style={[
            styles.topBar,
            {justifyContent: 'center', paddingHorizontal: 0},
          ]}>
          <TouchableOpacity
            style={[styles.tab, state.section === 0 && activeTabStyle]}
            onPress={() => {
              setState(state => {
                return {...state, section: 0};
              });
            }}>
            <Text style={{fontSize: 10, color: '#FFFFFF'}}>PAIRED DEVICES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, state.section === 1 && activeTabStyle]}
            onPress={() =>
              setState(state => {
                return {...state, section: 1};
              })
            }>
            <Text style={{fontSize: 10, color: '#FFFFFF'}}>
              UNPAIRED DEVICES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, state.section === 2 && activeTabStyle]}
            onPress={() =>
              setState(state => {
                return {...state, section: 2};
              })
            }>
            <Text style={{fontSize: 10, color: '#FFFFFF'}}>EXPERIMENT</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {state.discovering && state.section === 1 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator style={{marginBottom: 15}} size={60} />
          <Button
            textStyle={{color: '#FFFFFF'}}
            style={styles.buttonRaised}
            title="Cancel Discovery"
            onPress={cancelDiscovery}
          />
        </View>
      ) : (
        <DeviceList
          showConnectedIcon={state.section === 0}
          connectedId={state.device && state.device.id}
          devices={state.section === 0 ? state.devices : state.unpairedDevices}
          isConnected={state.connected}
          onDevicePress={device => {
            if (state.connected) disconnect(device);
            else onDevicePress(device);
          }}
        />
      )}
      {state.section === 2 && (
        <View style={{paddingTop: 10, backgroundColor: '#fff'}}>
          <ScrollView>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => {
                    write('N');
                  }, 0);
                }}
                activeOpacity={0.5}
                style={styles.databutton}>
                <Text style={styles.scanButtonText}>Start Work</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => {
                    write('C');
                  }, 0);
                }}
                activeOpacity={0.5}
                style={styles.databutton}>
                <Text style={styles.scanButtonText}>Stop Work</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => {
                    if (state.isSubscribed) deleteInterval();
                    else handleReadCharacter();
                  }, 0);
                }}
                activeOpacity={0.5}
                style={styles.databutton}>
                <Text style={styles.scanButtonText}>
                  {state.isSubscribed ? 'Stop Recieving' : 'Start Recieving'}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => {
                  if (!isReceivingData) startReceivingData(connectedDevices[0]);
                  else stopReceivingData(connectedDevices[0]);
                }}
                activeOpacity={0.5}
                style={styles.databutton}>
                <Text style={styles.scanButtonText} disabled={isReceivingData}>
                  {isReceivingData ? 'Stop Receiving' : 'Start Receive'}
                </Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
          onPress={() => handleSendMessage(connectedDevices[0])}
          activeOpacity={0.5}
          style={styles.scanButton}
        >
          <Text style={styles.scanButtonText} disabled={!isReceivingData}>{isReceivingData ? "Stop Recieving" : ""}</Text>
        </TouchableOpacity> */}
              {/* <Text style={styles.noDevicesText}>Received Data: {receivedData}</Text> */}
            </View>
            <ChartView data={chartDataState} />
            <View
              style={{alignItems: 'center', flexDirection: 'column', gap: 10}}>
              <Image
                source={require('./images/actual_vs_predicted.png')}
                style={{resizeMode: 'contain', width: 350, height: 250}}
              />
              <Image
                source={require('./images/actual_vs_predicted.png')}
                style={{resizeMode: 'contain', width: 350, height: 250}}
              />
              <Image
                source={require('./images/actual_vs_predicted.png')}
                style={{resizeMode: 'contain', width: 350, height: 250}}
              />
            </View>
          </ScrollView>
        </View>
      )}

      <View style={{alignSelf: 'flex-end', height: 52}}>
        <ScrollView horizontal contentContainerStyle={styles.fixedFooter}>
          {Platform.OS === 'android' && state.section === 1 ? (
            <Button
              title={state.discovering ? '... Discovering' : 'Discover devices'}
              onPress={discoverUnpaired}
            />
          ) : null}
          {Platform.OS === 'android' && !state.isEnabled ? (
            <Button title="Request enable" onPress={() => requestEnable()} />
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    backgroundColor: '#7B1FA2',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  enableInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    flex: 0.5,
    height: 56,
    justifyContent: 'center',
    borderBottomWidth: 6,
    borderColor: 'transparent',
  },
  connectionInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  connectionInfo: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 10,
    color: '#238923',
  },
  listContainer: {
    borderColor: '#ccc',
    borderTopWidth: 0.5,
  },
  listItem: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderColor: '#ccc',
    borderBottomWidth: 0.5,
    justifyContent: 'center',
  },
  fixedFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    height: 36,
    margin: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#7B1FA2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRaised: {
    backgroundColor: '#7B1FA2',
    borderRadius: 2,
    elevation: 2,
  },
  databutton: {
    backgroundColor: '#7B1FA2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default BluetoothSerialExample;
