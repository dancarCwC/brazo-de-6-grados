/* Crear nuevo puerto serial en Pin 2 y Pin 3 para conectar el Modulo bluetooth 
  By: http://elprofegarcia.com
  
  CONEXIONES:
  ARDUINO   BLUETOOTH
  5V        VCC
  GND       GND
  PIN 2     TX
  PIN 3     RX

  Tienda donde se compro los componentes: http://dinastiatecnologica.com
 */
 
#include <SoftwareSerial.h>

SoftwareSerial Serial_2 (2, 3);   // Crea nueva conexion- Pin2(RX) a TX y Pin3(TX) a RX
String Mensaje;                  // Variable de cadena de caracteres para almacenar el mensaje
char dato;
byte led =13;
void setup() {
    Serial_2.begin(9600); // Iniciamos el puerto nuevo Serial_2 a 9600 Baudios
    Serial.begin(9600);   // Iniciamos el puerto que esta conectado al PC a 9600 Baudios   
    pinMode(13,1);        // Configura Pin 13 como Salida 
}
 
void loop() {
/*  while (Serial_2.available()) {    // Mientras que lleguen caracteres por el puerto serial_2
     delay(5);
     char c = Serial_2.read();     // Lee los caracteres uno a uno en la variable c
     Mensaje += c;                 // Almacena la suma de caracteres en el mensaje
  }*/

if (Serial.available()){
    //leemos el dato enviado
    dato=Serial.read();
    if(dato=='1') { //letra   p - Prender
      digitalWrite(led, HIGH);
      //Serial.println("LED ON");
      Serial.write('1');
      Serial_2.write('1');
      
    }
    if(dato=='0') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('0');
      
      Serial_2.write('0');
    }
        if(dato=='2') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('2');
      
      Serial_2.write('2');
    }
        if(dato=='3') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('3');
      
      Serial_2.write('3');
    }

            if(dato=='4') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('4');
      
      Serial_2.write('4');
    }

            if(dato=='5') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('5');
      
      Serial_2.write('5');
    }

            if(dato=='6') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('6');
      
      Serial_2.write('6');
    }

            if(dato=='7') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('7');
      
      Serial_2.write('7');
    }

            if(dato=='8') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('8');
      
      Serial_2.write('8');
    }

            if(dato=='9') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('9');
      
      Serial_2.write('9');
    }

            if(dato=='A') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('A');
      
      Serial_2.write('A');
    }

            if(dato=='B') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('B');
      
      Serial_2.write('B');
    }

            if(dato=='C') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('C');
      
      Serial_2.write('C');
    }

            if(dato=='D') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('D');
      
      Serial_2.write('D');
    }

            if(dato=='E') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('E');
      
      Serial_2.write('E');
    }

            if(dato=='F') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('F');
      
      Serial_2.write('F');
    }

     if(dato=='G') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('G');
      
      Serial_2.write('G');
    }

     if(dato=='H') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('H');
      
      Serial_2.write('H');
    }

     if(dato=='I') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('I');
      
      Serial_2.write('I');
    }

     if(dato=='J') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('J');
      
      Serial_2.write('J');
    }

     if(dato=='K') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('K');
      
      Serial_2.write('K');
    }

     if(dato=='L') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('L');
      
      Serial_2.write('L');
    }

         if(dato=='M') { //letra a - Apagar
      digitalWrite(led, LOW);
      //Serial.println("LED OFF");
      Serial.write('M');
      
      Serial_2.write('M');
    }

         if(dato=='N') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('N');
      
      Serial_2.write('N');
    }

             if(dato=='O') { //letra a - Apagar
      digitalWrite(led, HIGH);
      //Serial.println("LED OFF");
      Serial.write('O');
      
      Serial_2.write('O');
    }
}
}
/*

  if (Mensaje.length()>0){       
     Serial.println(Mensaje);     // envia mensaje al PC 
     if (Mensaje == "encender"){
            digitalWrite(13,1);   // Enciende LED en Pin 13
     }
     if (Mensaje == "apagar"){   
            digitalWrite(13,0);   // Apaga LED en Pin 13 
     } 
  }  
  Mensaje="";                     // Borramos el mensaje ya enviado al PC
}
*/