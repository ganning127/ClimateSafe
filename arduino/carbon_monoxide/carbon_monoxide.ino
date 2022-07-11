
// Include Libraries
#include "Arduino.h"
#include "LiquidCrystal.h"
#include "MQ7.h"

#define A_PIN 2
#define VOLTAGE 5

// init MQ7 device
MQ7 mq7(A_PIN, VOLTAGE);
// Pin Definitions
#define LCD_PIN_RS 7
#define LCD_PIN_E 6
#define LCD_PIN_DB4 2
#define LCD_PIN_DB5 3
#define LCD_PIN_DB6 4
#define LCD_PIN_DB7 5
#define MQ7_5V_PIN_AOUT A3

// Global variables and defines

// object initialization
LiquidCrystal lcd(LCD_PIN_RS, LCD_PIN_E, LCD_PIN_DB4, LCD_PIN_DB5, LCD_PIN_DB6, LCD_PIN_DB7);

// define vars for testing menu
const int timeout = 10000; // define timeout of 10 sec
char menuOption = 0;
long time0;

// Setup the essentials for your circuit to work. It runs first every time your circuit is powered with electricity.
void setup()
{
    // Setup Serial which is useful for debugging
    // Use the Serial Monitor to view printed messages
    Serial.begin(9600);
    while (!Serial)
        ; // wait for serial port to connect. Needed for native USB

    // set up the LCD's number of columns and rows
    lcd.begin(16, 2);
    Serial.println(""); // blank new line
    lcd.setCursor(0, 0);
    lcd.print("Duke Summer STEM 2022");
    Serial.println("Calibrating MQ7");
    mq7.calibrate(); // calculates R0
    Serial.println("Calibration done!");
    lcd.clear();

    menuOption = menu();
}

// Main logic of your circuit. It defines the interaction between the components you selected. After setup, it runs over and over again, in an eternal loop.
void loop()
{
    if (menuOption == '1')
    {
        lcd.clear();
        Serial.print("PPM = ");
        double coPPM = mq7.readPpm();
        Serial.println(coPPM);
        lcd.setCursor(0, 0);
        lcd.print("PPM = " + String(coPPM));

        Serial.println(""); // blank new line
        delay(1000);
    }
    if (millis() - time0 > timeout)
    {
        menuOption = menu();
    }
}

char menu()
{

    Serial.println(F("\nWhich component would you like to test?"));
    Serial.println(F("(1) Carbon Monoxide Sensor - MQ-7"));

    lcd.clear();
    lcd.print("Ready");
    while (!Serial.available())
        ;

    // Read data from serial monitor if received
    while (Serial.available())
    {
        char c = Serial.read();
        if (isAlphaNumeric(c))
        {

            if (c == '1')
                Serial.println(F("Now Testing Carbon Monoxide Sensor - MQ-7 - note that this component doesn't have a test code"));
            else
            {
                Serial.println(F("illegal input!"));
                return 0;
            }
            time0 = millis();
            return c;
        }
    }
}
