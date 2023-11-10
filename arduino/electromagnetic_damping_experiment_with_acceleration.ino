#include <SoftwareSerial.h>
#include <Wire.h>

SoftwareSerial mySerial(10, 11);  // RX, TX

int main() {
  init();  // always remember this

  DDRB |= 1 << DDB5;

  // set the data rate for the SoftwareSerial port
  mySerial.begin(9600);
  Serial.begin(9600);
  mySerial.println("Hello, world? -via BT-");
  Serial.println("Hello, world? -via USB-");
  Wire.begin();                  // Initialize comunication
  Wire.beginTransmission(0x68);  // Start communication with MPU6050 // MPU=0x68
  Wire.write(0x6B);              // Talk to the register 6B
  Wire.write(0x00);              // Make reset - place a 0 into the 6B register
  Wire.endTransmission(true);    //end the transmission

  float currentTime, startTime;
  char val = 'C';

  for (;;) {
    if (mySerial.available()) {
      char temp = mySerial.read();  // read it and store it in 'val'
      mySerial.flush();
      if (temp == 'C') val = temp;
      else if (temp == 'N') {
        val = temp;
        startTime = millis();
      }
    } else 
    if (Serial.available()) {
      char temp = Serial.read();  // read it and store it in 'val'
      Serial.flush();
      if (temp == 'C') val = temp;
      else if (temp == 'S') {
        val = temp;
        startTime = millis();
      }
    }
    if (val == 'N') {
      // === Read gyroscope data === //
      currentTime = millis();                       // Current time actual time read
      float elapsedTime = currentTime - startTime;  // Divide by 1000 to get seconds
      Wire.beginTransmission(0x68);
      Wire.write(0x3B);  // Gyro data first register address 0x43
      Wire.endTransmission();
      Wire.requestFrom(0x68, 6);  // Read 4 registers total, each axis value is stored in 2 registers

      float AccX = (Wire.read() << 8 | Wire.read()) / 16384.0;  // For a 250deg/s range we have to divide first the raw value by 131.0, according to the datasheet
      float AccY = (Wire.read() << 8 | Wire.read()) / 16384.0;
      float AccZ = (Wire.read() << 8 | Wire.read()) / 16384.0;
      // Currently the raw values are in degrees per seconds, deg/s, so we need to multiply by sendonds (s) to get the angle in degrees
      float accAngleZ = (atan(AccY / sqrt(pow(AccX, 2) + pow(AccZ, 2))) * 180 / PI);

      // Print the values on the mySerial monitor
      mySerial.print(accAngleZ);
      mySerial.print('[');
      mySerial.print(elapsedTime);
      mySerial.print(']');
      mySerial.print(',');
    } else 
    if (val == 'S') {
      // === Read gyroscope data === //
      currentTime = millis();                       // Current time actual time read
      float elapsedTime = currentTime - startTime;  // Divide by 1000 to get seconds
      Wire.beginTransmission(0x68);
      Wire.write(0x3B);  // Gyro data first register address 0x43
      Wire.endTransmission();
      Wire.requestFrom(0x68, 6);  // Read 4 registers total, each axis value is stored in 2 registers

      float AccX = (Wire.read() << 8 | Wire.read()) / 16384.0;  // For a 250deg/s range we have to divide first the raw value by 131.0, according to the datasheet
      float AccY = (Wire.read() << 8 | Wire.read()) / 16384.0;
      float AccZ = (Wire.read() << 8 | Wire.read()) / 16384.0;
      // Currently the raw values are in degrees per seconds, deg/s, so we need to multiply by sendonds (s) to get the angle in degrees
      float accAngleZ = (atan(AccY / sqrt(pow(AccX, 2) + pow(AccZ, 2))) * 180 / PI);

      // Print the values on the mySerial monitor
      Serial.print(accAngleZ);
      Serial.print('[');
      Serial.print(elapsedTime);
      Serial.print(']');
      Serial.print(',');
    }
  }
}