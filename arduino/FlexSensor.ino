//Bluetooth
#include <SoftwareSerial.h>
SoftwareSerial miBT(10, 11);
const int PULGAR  = A4; // Pin connected to voltage divider output
const int INDICE  = A3;
const int MEDIO   = A2;
const int ANULAR  = A1;
const int MENIQUE = A0;
const int PUL = 0;
const int IND = 1;
const int MED = 2;
const int ANU = 3;
const int MEN = 4;

const float VCC = 4.98; // Measured voltage of Ardunio 5V line
const float R_DIV = 47500.0; // Measured resistance of 3.3k resistor
const float STRAIGHT_RESISTANCE = 37300.0; // resistance when straight
const float BEND_RESISTANCE = 10000.0; // resistance at 90 deg

void setup() 
{
  Serial.begin(9600);
  pinMode(PULGAR,   INPUT);
  pinMode(INDICE,   INPUT);
  pinMode(MEDIO,    INPUT);
  pinMode(ANULAR,   INPUT);
  pinMode(MENIQUE,  INPUT);
  miBT.begin(38400);
}

void loop() 
{
  int flexADC;
  float flexV;
  float flexR;
  float angle[5];

  /**
   * PULGAR
   */
  //flexADC = analogRead(PULGAR);
  angle[PUL] = analogRead(PULGAR);

  /**
   * INDICE
   */
   angle[IND] = analogRead(INDICE);

  /**
   * MEDIO
   */
  flexADC = analogRead(MEDIO);
  flexV = flexADC * VCC / 1023.0;
  flexR = R_DIV * (VCC / flexV - 1.0);
  angle[MED] = map(flexR, STRAIGHT_RESISTANCE, BEND_RESISTANCE, 0, 90.0);

  /**
   * ANULAR
   */
  flexADC = analogRead(ANULAR);
  flexV = flexADC * VCC / 1023.0;
  flexR = R_DIV * (VCC / flexV - 1.0);
  angle[ANU] = map(flexR, STRAIGHT_RESISTANCE, BEND_RESISTANCE, 0, 90.0);

  /**
   * MENIQUE
   */
  flexADC = analogRead(MENIQUE);
  flexV = flexADC * VCC / 1023.0;
  flexR = R_DIV * (VCC / flexV - 1.0);
  angle[MEN] = map(flexR, STRAIGHT_RESISTANCE, BEND_RESISTANCE, 0, 90.0);

  for(int i = PUL; i < 5; i++) {
    if(i != 4) {
      miBT.print(angle[i]);
      miBT.print(",");
    } else{
      miBT.println(angle[i]);
    }
  }
  for(int i = PUL; i < 5; i++) {
    if(i != 4) {
      Serial.print(angle[i]);
      Serial.print(",");
    } else{
      Serial.println(angle[i]);
    }
  }
  
  delay(2000);
  miBT.flush();
}
