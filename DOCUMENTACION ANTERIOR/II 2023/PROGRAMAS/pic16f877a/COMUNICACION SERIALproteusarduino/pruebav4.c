#include<pic.h>
#define _XTAL_FREQ 4000000
#include "USART.h"

#define uint unsigned int
#define PWM1H 50		//PWML-PWMH:0-255
#define PWM1L 25
#define PWM2H 50		
#define PWM2L 25
__CONFIG(0x3ce1);


//---------------------------
//Definicion de bit
//---------------------------
/*Botones*/
#define kzx RA0	//Izquierda
#define kyx RA1	//Derecha
#define kss1 RA2	//Arriba1
#define kxj1 RA3	//Abajo1
#define kss2 RA4	//Arriba2
#define kxj2 RA5	//Abajo2
#define kss3 RB1	//Arriba3
#define kxj3 RB2	//Abajo3
#define kszzx RB3	//Sujetando Izquierda
#define kszyx RB4	//Sujetando Derecha
#define kzj RB5	//Preste mucha atencion
#define kfs RC0	//Relajacion
#define kaut RC1	//Automatico
#define kreset RC3	//Reset
#define kstart RC4	//Start
#define kstop RC5	//Stop
/*Sensores*/
#define s1 RD0	//Sensor1
#define s2 RD1	//Sensor2
#define s3 RD2	//Sensor3
#define s4 RD3	//Sensor4
#define s5 RD4	//Sensor5
#define s6 RD5	//Limite de agarre
#define s7 RD6	//Limite de relajacion
/*Rele*/
#define zx RE0
#define yx RE1
#define xj1 RE2
#define ss1 RE3
#define ss2 RE4
#define xj2 RE5
#define ss3 RE6
#define xj3 RF0
#define szzx RF1
#define szyx RF2
#define fs RF3
#define zj RF4
//BANDERA
bit zmx;
bit zmy;
bit xmj1; 
bit xmss1;
bit xmss2; 
bit xmj2;
bit xmss3; 
bit xmj3;
bit xmzzx; 
bit xmzyx;
bit mfs; 
bit mzj; 

//---------------------------
//Retardo variable de segundo nivel
//Parametros> Rango 0.01-42.949.672
//---------------------------
void delay(uint sec)
{
 	uint i,j;
	j=sec*30;
   while(j--)
   {
    	i=1561;
    	while(--i);
   }
}
//---------------------------
//Inicializacion de I0
//---------------------------
void IO_init()
{
	TRISA=0xff;    //Puerto de entrada A   
	ANSELA=0x00;   //Modo de entradas digitales A
	TRISB=0xff;		//Puerto de entrada B
	TRISC=0xff;    //Puerto de entrada C
	APFCON=0xff;	//Habilitar funciones RD en el pin I0
	TRISD=0xff;		//Puerto de entrada D
	TRISE=0X00;		//Puerto de entrada E0,otra salida
	ANSELE=0x00;	//Modo de entradas digitales E
	TRISF=0x00;  	//Puerto de salida D
	ANSELF=0x00;   //Modo de I) digitales
	PORTE=0x00;
	PORTF=0x00;
}
//---------------------------
//Configuracion de PWM
//---------------------------
void PWM_init()
{
	PR2=PWM1H;           //PWMh
	CCP1CON=0x0f;  		//PWM modo
	CCPR1L=PWM1L;        //pwml
	CCPTMRS0=0x00;			//CCP1 para el Timer2 como temporizador
	T2CON=0X07;         	//temporizador 2 esta encendido¡¢dividido por 64
 	TRISC2=0;           	//RC2 establecido como salida
	 
	PR4=PWM2H;           //PWMh
	CCP2CON=0x0f;  		//PWM modo
	CCPR2L=PWM2L;       	//pwml
	CCPTMRS0=0x04;			//CCP2 para el Timer4como temporizador
	T4CON=0X07;         	//Temporizador 4 esta encendido, dividido por 64
	APFCON=0x04;			//CCP2 pin de salida por la RE7
	TRISE7=0;           	//RE7 establecido como salida	
}


void main(void) {

	char dato_rx;
	zx = 0;
	yx = 0;
	xj1 = 0;
	ss1 = 0;
	ss2 = 0;
	xj2 = 0;
	ss3 = 0;
	xj3 = 0;
	szzx = 0;
	szyx = 0;
	fs = 0;
	zj = 0;
	zmx = 1;
	zmy = 1;
	xmj1 =1; 
	xmss1=1;
	xmss2=1; 
	xmj2=1;
	xmss3=1; 
	xmj3=1;
	xmzzx=1; 
	xmzyx=1;
	mfs=1; 
	mzj=1; 

	IO_init();
	PWM_init();
	UART_init();
	UART_printf("comunicacion establecida\n\r");

	while(1)
	{
		dato_rx = UART_read();
		if(dato_rx == '0'){
			UART_printf("mov. a izquierda \n\r");
			zx = 0;
		}
		if((dato_rx == '1')&&(zmx)){
			UART_printf("mov. a izquierda \n\r");
			zx = 1;
			if(s1) zmx= 0; zmy=1;
		}
		if(dato_rx == '2'){
			UART_printf("mov. a derecha \n\r");
			yx = 0;
		}
		if((dato_rx == '3')&&(zmy)){
			UART_printf("mov. a derecha \n\r");
			yx = 1;
			if(s1) zmy= 0; zmx=1;
		}
		if(dato_rx == '4'){
			UART_printf("mov. abajo1 \n\r");
			xj1 = 0;
		}
		if((dato_rx == '5')&&xmj1){
			UART_printf("mov. abajo1 \n\r");
			xj1 = 1;
			if(s2) xmj1=0; xmss1=1; 
		}
		if(dato_rx == '6'){
			UART_printf("mov. arriba1 \n\r");
			ss1 = 0;
		}
		if((dato_rx == '7')&&(xmss1)){
			UART_printf("mov. arriba1 \n\r");
			ss1 = 1;
			if(s2) xmss1=0; xmj1=1;
		}
		if(dato_rx == '8'){
			UART_printf("mov. arriba2 \n\r");
			ss2 = 0;
		}
		if((dato_rx == '9')&&(xmss2)){
			UART_printf("mov. arriba2 \n\r");
			ss2 = 1;
			if(s3) xmss2=0; xmj2=1;
		}
		if(dato_rx == 'A'){
			UART_printf("mov. abajo2 \n\r");
			xj2 = 0;
		}
		if((dato_rx == 'B')&&(xmj2)){
			UART_printf("mov. abajo2 \n\r");
			xj2 = 1;
			if(s3) xmj2=0; xmss2=1;
		}
		if(dato_rx == 'C'){
			UART_printf("mov. arriba3 \n\r");
			ss3 = 0;
		}
		if((dato_rx == 'D')&&(xmss3)){
			UART_printf("mov. arriba3 \n\r");
			ss3 = 1;
			if(s4) xmss3=0; xmj3=1;
		}
		if(dato_rx == 'E'){
			UART_printf("mov. abajo3 \n\r");
			xj3 = 0;
		}
		if((dato_rx == 'F')&&(xmj3)){
			UART_printf("mov. abajo3 \n\r");
			xj3 = 1;
			if(s4) xmj3=0; xmss3=1;
		}
		if(dato_rx == 'G'){
			UART_printf("sujetando izquierda \n\r");
			szzx = 0;
		}
		if((dato_rx == 'H')&&(xmzzx)){
			UART_printf("sujetando izquierda \n\r");
			szzx = 1;
			if(s5) xmzzx=0; xmzyx=1;
		}
		if(dato_rx == 'I'){
			UART_printf("sujetando derecha \n\r");
			szyx = 0;
		}
		if((dato_rx == 'J')&&(xmzyx)){
			UART_printf("sujetando derecha \n\r");
			szyx = 1;
			if(s5) xmzyx=0; xmzzx=1;
		}
		if(dato_rx == 'K'){
			UART_printf("relajacion \n\r");
			fs = 0;
		}
		if((dato_rx == 'L')&&(mfs)){
			UART_printf("relajacion \n\r");
			fs = 1;
			if(s6) mfs=0; mzj=1; 
		}
		if(dato_rx == 'M'){
			UART_printf("preste atencion \n\r");
			zj = 0;
		}
		if((dato_rx == 'N')&&(mzj)){
			UART_printf("preste atencion \n\r");
			zj = 1;
			if(s7) mzj=0; mfs=1;
		}
	}
	return;
}