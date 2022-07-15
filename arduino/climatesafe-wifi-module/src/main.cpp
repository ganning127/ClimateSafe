/*
 * HelTec Automation(TM) WIFI_Kit_32 factory test code, witch includ
 * follow functions:
 *
 * - Basic OLED function test;
 *
 * - Basic serial port test(in baud rate 115200);
 *
 * - LED blink test;
 *
 * - WIFI join and scan test;
 *
 * - Timer test and some other Arduino basic functions.
 *
 * by Aaron.Lee from HelTec AutoMation, ChengDu, China
 * 成都惠利特自动化科技有限公司
 * www.heltec.cn
 *
 * this project also realess in GitHub:
 * https://github.com/HelTecAutomation/Heltec_ESP32
 */

#include "heltec.h"
#include "WiFi.h"
#include "images.h"
#include <SPI.h>
#include <HTTPClient.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include "DHTesp.h"
#include <cmath>
#include <sstream>
#include <string>
#include <iostream>
#include "MQ7.h"
#include <MQUnifiedsensor.h>
#include <Wire.h>
#include "MQ2.h"
#define A_PIN 33
#define VOLTAGE 3.3
#include <TinyGPSPlus.h>
/*
   This sample sketch should be the first you try out when you are testing a TinyGPSPlus
   (TinyGPSPlus) installation.  In normal use, you feed TinyGPSPlus objects characters from
   a serial NMEA GPS device, but this example uses static strings for simplicity.
*/

// A sample NMEA stream.
const char *gpsStream =
    "$GPRMC,045103.000,A,3014.1984,N,09749.2872,W,0.67,161.46,030913,,,A*7C\r\n"
    "$GPGGA,045104.000,3014.1985,N,09749.2873,W,1,09,1.2,211.6,M,-22.5,M,,0000*62\r\n"
    "$GPRMC,045200.000,A,3014.3820,N,09748.9514,W,36.88,65.02,030913,,,A*77\r\n"
    "$GPGGA,045201.000,3014.3864,N,09748.9411,W,1,10,1.2,200.8,M,-22.5,M,,0000*6C\r\n"
    "$GPRMC,045251.000,A,3014.4275,N,09749.0626,W,0.51,217.94,030913,,,A*7D\r\n"
    "$GPGGA,045252.000,3014.4273,N,09749.0628,W,1,09,1.3,206.9,M,-22.5,M,,0000*6F\r\n";

// The TinyGPSPlus object
TinyGPSPlus gps;

using namespace std;

void displayInfo(void);
MQ7 mq7(A_PIN, VOLTAGE);
MQ2 mq2(35);

const int MQ5 = 34;
float gas_value;

int counter = 0;

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

// Number of milliseconds to wait without receiving any data before we give up
const int kNetworkTimeout = 30 * 1000;
// Number of milliseconds to wait if no data is available before trying again
const int kNetworkDelay = 1000;
HTTPClient http;
DHTesp dht;
float temperature;
float humidity;

void logo()
{
    Heltec.display->clear();
    Heltec.display->drawXbm(0, 5, logo_width, logo_height, (const unsigned char *)logo_bits);
    Heltec.display->display();
}

void WIFISetUp(void)
{
    // Set WiFi to station mode and disconnect from an AP if it was previously connected
    WiFi.disconnect(true);
    delay(1000);
    WiFi.mode(WIFI_STA);
    WiFi.setAutoConnect(true);
    WiFi.begin("Blah", "hellogello");
    delay(100);

    byte count = 0;
    while (WiFi.status() != WL_CONNECTED && count < 10)
    {
        count++;
        delay(500);
        Heltec.display->drawString(0, 0, "Connecting...");
        Heltec.display->display();
    }

    Heltec.display->clear();
    if (WiFi.status() == WL_CONNECTED)
    {
        Heltec.display->drawString(0, 0, "Connecting...OK.");
        Heltec.display->display();
    }
    else
    {
        Heltec.display->clear();
        Heltec.display->drawString(0, 0, "Connecting...Failed");
        Heltec.display->display();
    }
    Heltec.display->drawString(0, 10, "WIFI Setup done");
    Heltec.display->display();
    Heltec.display->clear();

    delay(500);
}

void setup()
{
    Serial.begin(115200);

    while (!Serial)
        ; // wait for serial port to connect. Needed for native USB

    dht.setup(27, DHTesp::DHT11);

    temperature = dht.getTemperature();
    humidity = dht.getHumidity();

    pinMode(LED, OUTPUT);
    digitalWrite(LED, HIGH);

    pinMode(MQ5, INPUT);

    Heltec.begin(true /*DisplayEnable Enable*/, false /*LoRa Enable*/, true /*Serial Enable*/);

    logo();
    delay(300);
    Heltec.display->clear();
    WIFISetUp();

    delay(3000);
    WiFi.mode(WIFI_STA);
    WiFi.setAutoConnect(true);
    Heltec.display->clear();
    Heltec.display->drawString(0, 0, "Calibrating CO sensor...");
    Heltec.display->display();

    mq7.calibrate(); // calculates R0
    mq2.begin();
}

void loop()
{

    // if (Serial.available())
    // {
    //     if (gps.encode(Serial.read()))
    //         displayInfo();
    // }
    counter++;

    String hardware_id = "demo-board";
    temperature = dht.getTemperature();
    humidity = dht.getHumidity();
    float coPPM = mq7.readPpm();
    float *MQ2values = mq2.read(false); // set it false if you don't want to print the values in the Serial
    float gas_smoke = MQ2values[2];
    float lpg = MQ2values[0];
    float combust_gas = analogRead(MQ5);

    String combustableGasDisplay = "combGas: " + (String)combust_gas;
    String temperatureDisplay = "temp: " + (String)temperature + "°C";
    String humidityDisplay = "humidity: " + (String)humidity + "%";
    String coPPMDisplay = "CO: " + (String)coPPM + "ppm";
    String smokeDisplay = "Smoke: " + (String)gas_smoke;
    String lpgDisplay = "LPG: " + (String)lpg;

    Heltec.display->clear();
    Heltec.display->drawString(90, 0, (String)counter);

    Heltec.display->drawString(0, 0, temperatureDisplay);
    Heltec.display->drawString(0, 12, humidityDisplay);
    Heltec.display->drawString(0, 24, coPPMDisplay);
    Heltec.display->drawString(0, 36, smokeDisplay);
    Heltec.display->drawString(0, 48, lpgDisplay);
    Heltec.display->drawString(0, 60, combustableGasDisplay);

    Heltec.display->display();

    stringstream url;
    url << "https://climatesafe.vercel.app/api/arduino-post"
        << "?temp=" << to_string(temperature) << "&humidity=" << to_string(humidity) << "&co=" << to_string(coPPM) << "&hardware_id=demo-board"
        << "&gas_smoke=" << to_string(gas_smoke) << "&lpg=" << to_string(lpg) << "&combust_gas=" << to_string(combust_gas);

    Serial.println();
    Serial.println(url.str().c_str());

    http.begin(url.str().c_str());
    int httpResponseCode = http.GET();

    String payload = http.getString(); // HTTP Response
    Serial.println(payload);

    // Heltec.display->drawString(0, 36, payload);
    // Heltec.display->display();
    delay(1000);
}

void displayInfo()
{
    Serial.print(F("Location: "));
    if (gps.location.isValid())
    {
        Serial.print(gps.location.lat(), 6);
        Serial.print(F(","));
        Serial.print(gps.location.lng(), 6);
    }
    else
    {
        Serial.print(F("INVALID"));
    }

    Serial.print(F("  Date/Time: "));
    if (gps.date.isValid())
    {
        Serial.print(gps.date.month());
        Serial.print(F("/"));
        Serial.print(gps.date.day());
        Serial.print(F("/"));
        Serial.print(gps.date.year());
    }
    else
    {
        Serial.print(F("INVALID"));
    }

    Serial.print(F(" "));
    if (gps.time.isValid())
    {
        if (gps.time.hour() < 10)
            Serial.print(F("0"));
        Serial.print(gps.time.hour());
        Serial.print(F(":"));
        if (gps.time.minute() < 10)
            Serial.print(F("0"));
        Serial.print(gps.time.minute());
        Serial.print(F(":"));
        if (gps.time.second() < 10)
            Serial.print(F("0"));
        Serial.print(gps.time.second());
        Serial.print(F("."));
        if (gps.time.centisecond() < 10)
            Serial.print(F("0"));
        Serial.print(gps.time.centisecond());
    }
    else
    {
        Serial.print(F("INVALID"));
    }

    Serial.println();
}