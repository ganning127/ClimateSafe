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

static char LAT[10];
static char LONG[10];
HardwareSerial GPSSerial(2);
unsigned char buffer[256];
int GPScount = 0;

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

    // Start the hardware serial (rx2,tx2) to read data from gps device
    // Initialize serial monitor and wait for port to open
    // GPSSerial.begin(9600, SERIAL_8N1, 16, 17);
    // Serial.begin(115200);
    // delay(10);
    // Serial.print("#################\nInitializing...");

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

    // if (Serial.available() > 0)
    // {
    //     Serial.println("serial available");

    // if (gps.encode(*gpsStream++))
    // {
    //     Serial.println("gps encoded");
    //     displayInfo();
    // }
    // }

    // while (GPSSerial.available())
    // {
    //     buffer[GPScount++] = GPSSerial.read();
    //     if (GPScount == 256)
    //     {
    //         break;
    //     }
    // }

    // // Cast GPS Data Buffer as String
    // String myString = (const char *)buffer;

    // // Find the Line you are interested in
    // if (myString.startsWith("$GPRMC"))
    // {

    //     // Trim String from second "$" to end
    //     myString.remove(myString.indexOf("$", 1));

    //     // Trim String up to first ","
    //     int idx = myString.indexOf(",");
    //     idx++;
    //     myString.remove(0, idx);

    //     // Trim String up to first ","
    //     idx = myString.indexOf(",");
    //     idx++;
    //     myString.remove(0, idx);

    //     // Now String begins with Verification Value
    //     char veribuff[2];
    //     myString.toCharArray(veribuff, 2);
    //     Serial.print("Receiver Verification : ");
    //     Serial.println(veribuff);

    //     // Trim String up to first ","
    //     idx = myString.indexOf(",");
    //     idx++;
    //     myString.remove(0, idx);

    //     // Now String begins with Latitude Value
    //     char latibuff[11];
    //     char outLat[2];
    //     char calcbuf[9];
    //     myString.toCharArray(latibuff, 11);

    //     // Extract the Degree Section
    //     outLat[0] = latibuff[0];
    //     outLat[1] = latibuff[1];

    //     // Extract The Minutes and Seconds for Decimalization
    //     for (int i = 0; i <= 8; i++)
    //     {
    //         calcbuf[i] = latibuff[i + 2];
    //     }

    //     float calcVal;
    //     calcVal = atof(outLat) + (atof(calcbuf) / 60);

    //     // Moved Serial Prints below to account for +- NS

    //     // Trim String up to first ","
    //     idx = myString.indexOf(",");
    //     idx++;
    //     myString.remove(0, idx);

    //     // Now String begins with N/S Value (+-)
    //     char NSbuff[2];
    //     myString.toCharArray(NSbuff, 2);

    //     // To Account for +- NS affecting the sign of Latitude
    //     // Southern Hemisphere Latitudes have a minus sign
    //     if (NSbuff[0] == 'S')
    //     {
    //         calcVal *= -1;
    //     }

    //     Serial.print("Latitude : ");
    //     Serial.println(calcVal, 5);

    //     Serial.print("N/S : ");
    //     Serial.println(NSbuff[0]);

    //     // Trim String up to first ","
    //     idx = myString.indexOf(",");
    //     idx++;
    //     myString.remove(0, idx);

    //     // Now String begins with Longitude Value
    //     char longibuff[12];
    //     char outLNG[3];
    //     char calcbuf2[9];
    //     myString.toCharArray(longibuff, 12);

    //     // Extract the Degree Section
    //     outLNG[0] = longibuff[0];
    //     outLNG[1] = longibuff[1];
    //     outLNG[2] = longibuff[2];

    //     // Extract The Minutes and Seconds for Decimalization
    //     for (int i = 0; i <= 8; i++)
    //     {
    //         calcbuf2[i] = longibuff[i + 3];
    //     }

    //     float calcVal2;

    //     calcVal2 = atof(outLNG) + (atof(calcbuf2) / 60);

    //     // Moved Serial prints below to account for +- EW

    //     // Trim String up to first ","
    //     idx = myString.indexOf(",");
    //     idx++;
    //     myString.remove(0, idx);

    //     // Now String begins with E/W Value (+-)
    //     char EWbuff[2];
    //     myString.toCharArray(EWbuff, 2);

    //     // To Account for +- EW which affects the sign of Longitude
    //     // Western Hemisphere Latitudes have a minus sign
    //     if (EWbuff[0] == 'W')
    //     {
    //         calcVal2 *= -1;
    //     }

    //     Serial.print("Longitude : ");
    //     Serial.println(calcVal2, 5);

    //     Serial.print("E/W : ");
    //     Serial.println(EWbuff[0]);
    //     Serial.println("#################");

    //     // Convert the Floats, Latitude & Longtitude to char[] for sending in Request
    //     dtostrf(calcVal, 7, 5, LAT);
    //     dtostrf(calcVal2, 7, 5, LONG);

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

    // // Heltec.display->drawString(0, 36, payload);
    // // Heltec.display->display();
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