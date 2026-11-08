#include<pic.h>
#define uchar unsigned char
#define uint unsigned int
#define PWM1H 50		//PWML-PWMH:0-255
#define PWM1L 25
#define PWM2H 50		
#define PWM2L 25
__CONFIG(0x3ce1);       /*La configuraci¨®n del sistema, desactivar el watchdog*/
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
/*Variables internas*/
uchar run;		                              //Bandera de la operacion del equipo
uchar reset;                                 //Indicador de reposicion de dispositivos
uchar zxxw,yxxw,xj1xw,ss1xw,xj2xw,ss2xw;   	//Limite de signos
uchar xj2xw,ss3xw,xj3xw,szzxxw,szyxxw;       //Limite de signos
uchar zero1,zero2,zero3,zero4,zero5;         //Marca de posicion de reposo
uchar rover=1;
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
//---------------------------
//Rutina de comprobacion de estado inicial
//---------------------------
void check()
{
	if(!s1)zero1=1;
		else zero1=0;
	if(!s2)zero2=1;
		else zero2=0;	
	if(!s3)zero3=1;
		else zero3=0;
	if(!s4)zero4=1;
		else zero4=0;
	if(!s5)zero5=1;
		else zero5=0;
}
//---------------------------
//Subrutina manual
//---------------------------
void hand()
{
	while((!kzx)&&(!zxxw))		//izquierda
	{		
		zx=1;
		if(s1)
		{
			zero1=0;
			yxxw=0;
		}
		if((!zero1)&&(!s1))zxxw=1;
	}
	while((!kyx)&&(!yxxw)) 		//Derecha
	{
		yx=1;
		if(s1)
		{
			zero1=0;
			zxxw=0;
		}
		if((!zero1)&&(!s1))yxxw=1;
	}
	while((!kss1)&&(!ss1xw))		//arriba1
	{
		ss1=1;
		if(s2)
		{
			zero2=0;
			xj1xw=0;
		}
		if((!zero2)&&(!s2))ss1xw=1;
	}	
	while((!kxj1)&&(!xj1xw))		//abajo1
	{
		xj1=1;
		if(s2)
		{
			zero2=0;
			ss1xw=0;
		}
		if((!zero2)&&(!s2))xj1xw=1;
	}
	while((kss2==0)&&(ss2xw==0))		//arriba2
	{
		ss2=1;
		if(s3)
		{
			zero3=0;
			xj2xw=0;
		}
		if((!zero3)&&(!s3))ss2xw=1;
	}
	while((!kxj2)&&(!xj2xw))		//abajo2
	{
		xj2=1;
		if(s3)
		{
			zero3=0;
			ss2xw=0;
		}
		if((!zero3)&&(!s3))xj2xw=1;
	}
	while((!kss3)&&(!ss3xw))		//arriba3
	{
		ss3=1;
		if(s4)
		{
			zero4=0;
			xj3xw=0;
		}
		if((!zero4)&&(!s4))ss3xw=1;
	}
	while((!kxj3)&&(!xj3xw))		//abajo3
	{
		xj3=1;
		if(s4)
		{
			zero4=0;
			ss3xw=0;
		}
		if((!zero4)&&(!s4))xj3xw=1;
	}
	while((!kszzx)&&(!szzxxw))	   //agarrando a la izquierda
	{
		szzx=1;
		if(s5)
		{
			zero5=0;
			szyxxw=0;
		}
		if((!zero5)&&(!s5))szzxxw=1;
	}
	while((!kszyx)&&(!szyxxw))	   //agarrando a la derecha
	{
		szyx=1;
		if(s5)
		{
			zero5=0;
			szzxxw=0;
		}
		if((!zero5)&&(!s5))szyxxw=1;
	}
	while((!kzj)&&(s6))		//Preste mucha atencion
		zj=1;
	while((!kfs)&&(s7))		//Relajacion
		fs=1;
	PORTE=0x00;
	PORTF=0x00;
}
//---------------------------
//Procedimiento de restablecimiento del dispositivo
//---------------------------
void rest()
{
	if(rover)
	{
		while(s2){xj1=1;}
		xj1=0;
		while(s3){xj2=1;}
		xj2=0;
		while(s4){xj3=1;}
		xj3=0;
		while(s7){fs=1;}
		fs=0;
		ss1=1;
		delay(10);
		ss1=0;
		ss2=1;
		delay(20);
		ss2=0;
		ss3=1;
		delay(10);
		ss3=0;
	}
	rover=0;	
}
//---------------------------
//×ÔSubrutina automatica
//---------------------------
void aut()
{
	yx=1;
	delay(8);
	yx=0;
	xj1=1;
	delay(10);
	xj1=0;
	xj2=1;
	delay(10);
	xj2=0;
	zj=1;
	delay(10);
	zj=0;
	ss1=1;
	delay(15);
	ss1=0;
	yx=1;
	delay(50);
	yx=0;
	xj1=1;
	delay(15);
	xj1=0;
	fs=1;
	delay(10);
	fs=0;
	ss2=1;
	delay(10);
	ss2=0;
	ss1=1;
	delay(10);
	ss1=0;
	while(s1)zx=1;
	zx=0;
}
//---------------------------
//Consulta
//---------------------------
void keycan()
{
	if(kstart==0)
		run=1;
	if(kstop==0)
		run=0;
}
//---------------------------
//Programa principal
//---------------------------
void main()
{
	IO_init();
	PWM_init();
	while(1)
	{
		while(!kaut)
		{
			keycan();
			check();
			hand();
		}	
		while(kaut)
		{
			keycan();
			rest();
			while(run)
			{
				aut();
				keycan(); 
			}
		}
	}
}

