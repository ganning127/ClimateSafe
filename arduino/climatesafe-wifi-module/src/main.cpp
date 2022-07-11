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
// #include <HttpClient.h>
#include <SPI.h>
#include <HTTPClient.h>
#include <Ethernet.h>
#include <EthernetClient.h>

// Name of the server we want to connect to
const char kHostname[] = "arduino.cc";
// Path to download (this is the bit after the hostname in the URL
// that you want to download
const char kPath[] = "/";

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

// Number of milliseconds to wait without receiving any data before we give up
const int kNetworkTimeout = 30 * 1000;
// Number of milliseconds to wait if no data is available before trying again
const int kNetworkDelay = 1000;
HTTPClient http;
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
        //		delay(500);
    }
    else
    {
        Heltec.display->clear();
        Heltec.display->drawString(0, 0, "Connecting...Failed");
        Heltec.display->display();
        //		while(1);
    }
    Heltec.display->drawString(0, 10, "WIFI Setup done");
    Heltec.display->display();
    Heltec.display->clear();
    // Heltec.display->display();

    delay(500);
}

void WIFIScan(void)
{
    Heltec.display->drawString(0, 20, "Scan start...");
    Heltec.display->display();

    int n = WiFi.scanNetworks();
    Heltec.display->drawString(0, 30, "Scan done");
    Heltec.display->display();
    delay(500);
    Heltec.display->clear();

    if (n == 0)
    {
        Heltec.display->clear();
        Heltec.display->drawString(0, 0, "no network found");
        Heltec.display->display();
        while (1)
            ;
    }
    else
    {
        Serial.print(n);
        Heltec.display->drawString(0, 0, (String)n);
        Heltec.display->drawString(14, 0, "networks found:");
        Heltec.display->display();
        delay(500);

        for (int i = 0; i < n; ++i)
        {
            // Print SSID and RSSI for each network found
            Heltec.display->drawString(0, (i + 1) * 9, (String)(i + 1));
            Heltec.display->drawString(6, (i + 1) * 9, ":");
            Heltec.display->drawString(12, (i + 1) * 9, (String)(WiFi.SSID(i)));
            Heltec.display->drawString(90, (i + 1) * 9, " (");
            Heltec.display->drawString(98, (i + 1) * 9, (String)(WiFi.RSSI(i)));
            Heltec.display->drawString(114, (i + 1) * 9, ")");
            //            display.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN)?" ":"*");
            delay(10);
        }
    }

    Heltec.display->display();
    delay(800);
    Heltec.display->clear();
}

void setup()
{

    pinMode(LED, OUTPUT);
    digitalWrite(LED, HIGH);

    Heltec.begin(true /*DisplayEnable Enable*/, false /*LoRa Enable*/, true /*Serial Enable*/);

    logo();
    delay(300);
    Heltec.display->clear();
    WIFISetUp();

    // WiFi.disconnect(true); // Reinitialize WIFI
    delay(1000);
    WiFi.mode(WIFI_STA);
    WiFi.setAutoConnect(true);

    Serial.begin(9600);
}

void loop()
{
    // WIFIScan();
    //  HTTPClient http;
    String serverPath = "https://jsonplaceholder.typicode.com/todos/1";

    // Your Domain name with URL path or IP address with path
    http.begin(serverPath.c_str());

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
        Heltec.display->clear();
        Heltec.display->drawString(0, 0, payload);
        Heltec.display->display();
    }

    delay(1000);
}
