/*
    Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleWrite.cpp
    Ported to Arduino ESP32 by Evandro Copercini
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#include <BLE2902.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define BLE_NAME "VWTOURAN" //must match filters name in bluetoothterminal.js- navigator.bluetooth.requestDevice
//#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e" //- must match optional services on navigator.bluetooth.requestDevice
//#define CHARACTERISTIC_UUID "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

//maintain compatability with HM-10
BLEUUID  SERVICE_UUID((uint16_t)0xFFE0); // UART service UUID
BLEUUID CHARACTERISTIC_UUID ((uint16_t)0xFFE1);
BLEUUID TEMPERATURE_UUID ((uint16_t)0xFFF0);
/*
 * navigator.bluetooth.requestDevice({
   
    filters: [{
        name: 'ESP32'
      }],
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
      '6e400003-b5a3-f393-e0a9-e50e24dcca9e']
    }).
*/


//BLEUUID  SERVICE_UUID((uint16_t)0xFFE0); // UART service UUID
//BLEUUID CHARACTERISTIC_UUID((uint16_t)0xFFE1);

//BLEUUID CHARACTERISTIC_UUID_RX((uint16_t)0xFFE2);

#ifdef __cplusplus

extern "C" {

#endif

uint8_t temprature_sens_read();

#ifdef __cplusplus

};

#endif
uint8_t temprature_sens_read();

class MyCallbacks: public BLECharacteristicCallbacks {
  
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value.length() > 0) {
        pCharacteristic->setValue(value +"\n"); // must add seperator \n for it to register on BLE terminal
        pCharacteristic->notify();
        if(value == "lights_toggle"){
            if(digitalRead(25)){
              digitalWrite(25, LOW);
              }else{
                digitalWrite(25, HIGH);
              }
          }
          if(value == "lights_flash"){
            digitalWrite(25, LOW);
            delay(600);
            digitalWrite(25, HIGH);
            delay(500);
            digitalWrite(25, LOW);
            delay(600);
            digitalWrite(25, HIGH);
          }
      }
    }
};


class BLEServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer, esp_ble_gatts_cb_param_t *param) override {
    BLEDevice::startAdvertising();
  }
} bleServerCB;

void setup() {
  Serial.begin(115200);
  pinMode(25, OUTPUT);
digitalWrite(25, HIGH);
  BLEDevice::init(BLE_NAME);
  BLEServer *pServer = BLEDevice::createServer();
pServer->setCallbacks(&bleServerCB);
  BLEService *pService = pServer->createService(SERVICE_UUID);

  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE |
                                         BLECharacteristic::PROPERTY_NOTIFY
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());
  
  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

void loop() {
  delay(2000);
 
}
