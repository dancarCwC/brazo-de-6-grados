opt subtitle "HI-TECH Software Omniscient Code Generator (Lite mode) build 10920"

opt pagewidth 120

	opt lm

	processor	16F1946
clrc	macro
	bcf	3,0
	endm
clrz	macro
	bcf	3,2
	endm
setc	macro
	bsf	3,0
	endm
setz	macro
	bsf	3,2
	endm
skipc	macro
	btfss	3,0
	endm
skipz	macro
	btfss	3,2
	endm
skipnc	macro
	btfsc	3,0
	endm
skipnz	macro
	btfsc	3,2
	endm
indf	equ	0
indf0	equ	0
indf1	equ	1
pc	equ	2
pcl	equ	2
status	equ	3
fsr0l	equ	4
fsr0h	equ	5
fsr1l	equ	6
fsr1h	equ	7
bsr	equ	8
wreg	equ	9
intcon	equ	11
c	equ	1
z	equ	0
pclath	equ	10
# 8 "H:\PIC\Machine hand.c"
	psect config,class=CONFIG,delta=2 ;#
# 8 "H:\PIC\Machine hand.c"
	dw 0x3ce1 ;#
	FNCALL	_main,_IO_init
	FNCALL	_main,_PWM_init
	FNCALL	_main,_hand
	FNROOT	_main
	global	_run
	global	_PORTE
psect	text101,local,class=CODE,delta=2
global __ptext101
__ptext101:
_PORTE	set	16
	global	_PR2
_PR2	set	27
	global	_T2CON
_T2CON	set	28
	global	_CARRY
_CARRY	set	24
	global	_GIE
_GIE	set	95
	global	_RA0
_RA0	set	96
	global	_RA1
_RA1	set	97
	global	_RA2
_RA2	set	98
	global	_RA3
_RA3	set	99
	global	_RA4
_RA4	set	100
	global	_RA5
_RA5	set	101
	global	_RB1
_RB1	set	105
	global	_RB2
_RB2	set	106
	global	_RB3
_RB3	set	107
	global	_RB4
_RB4	set	108
	global	_RB5
_RB5	set	109
	global	_RC0
_RC0	set	112
	global	_RC4
_RC4	set	116
	global	_RC7
_RC7	set	119
	global	_RD1
_RD1	set	121
	global	_RD3
_RD3	set	123
	global	_RD5
_RD5	set	125
	global	_RD6
_RD6	set	126
	global	_RD7
_RD7	set	127
	global	_RE1
_RE1	set	129
	global	_RE2
_RE2	set	130
	global	_RE3
_RE3	set	131
	global	_RE4
_RE4	set	132
	global	_RE5
_RE5	set	133
	global	_RE6
_RE6	set	134
	global	_TRISA
_TRISA	set	140
	global	_TRISB
_TRISB	set	141
	global	_TRISC
_TRISC	set	142
	global	_TRISD
_TRISD	set	143
	global	_TRISE
_TRISE	set	144
	global	_TRISC2
_TRISC2	set	1138
	global	_TRISE7
_TRISE7	set	1159
	global	_APFCON
_APFCON	set	285
	global	_EEADR
_EEADR	set	401
	global	_ANSELA
_ANSELA	set	396
	global	_ANSELE
_ANSELE	set	400
	global	_EECON1
_EECON1	set	405
	global	_EECON2
_EECON2	set	406
	global	_EEDATA
_EEDATA	set	403
	global	_RD
_RD	set	3240
	global	_WR
_WR	set	3241
	global	_WREN
_WREN	set	3242
	global	_CCP1CON
_CCP1CON	set	659
	global	_CCP2CON
_CCP2CON	set	666
	global	_CCPR1L
_CCPR1L	set	657
	global	_CCPR2L
_CCPR2L	set	664
	global	_CCPTMRS0
_CCPTMRS0	set	670
	global	_PORTF
_PORTF	set	652
	global	_RF0
_RF0	set	5216
	global	_RF1
_RF1	set	5217
	global	_RF2
_RF2	set	5218
	global	_RF3
_RF3	set	5219
	global	_RF4
_RF4	set	5220
	global	_RF5
_RF5	set	5221
	global	_TRISF
_TRISF	set	780
	global	_ANSELF
_ANSELF	set	1036
	global	_PR4
_PR4	set	1046
	global	_T4CON
_T4CON	set	1047
	file	"Hand.as"
	line	#
psect cinit,class=CODE,delta=2
global start_initialization
start_initialization:

psect	bssCOMMON,class=COMMON,space=1
global __pbssCOMMON
__pbssCOMMON:
_run:
       ds      1

; Clear objects allocated to COMMON
psect cinit,class=CODE,delta=2
	global __pbssCOMMON
	clrf	((__pbssCOMMON)+0)&07Fh
psect cinit,class=CODE,delta=2
global end_of_initialization

;End of C runtime variable initialization code

end_of_initialization:
movlb 0
ljmp _main	;jump to C main() function
psect	cstackCOMMON,class=COMMON,space=1
global __pcstackCOMMON
__pcstackCOMMON:
	global	?_IO_init
?_IO_init:	; 0 bytes @ 0x0
	global	??_IO_init
??_IO_init:	; 0 bytes @ 0x0
	global	?_PWM_init
?_PWM_init:	; 0 bytes @ 0x0
	global	??_PWM_init
??_PWM_init:	; 0 bytes @ 0x0
	global	?_hand
?_hand:	; 0 bytes @ 0x0
	global	??_hand
??_hand:	; 0 bytes @ 0x0
	global	?_main
?_main:	; 0 bytes @ 0x0
	global	??_main
??_main:	; 0 bytes @ 0x0
;;Data sizes: Strings 0, constant 0, data 0, bss 1, persistent 0 stack 0
;;Auto spaces:   Size  Autos    Used
;; COMMON          14      0       1
;; BANK0           80      0       0
;; BANK1           80      0       0
;; BANK2           80      0       0
;; BANK3           80      0       0
;; BANK4           80      0       0
;; BANK5           80      0       0
;; BANK6           16      0       0

;;
;; Pointer list with targets:



;;
;; Critical Paths under _main in COMMON
;;
;;   None.
;;
;; Critical Paths under _main in BANK0
;;
;;   None.
;;
;; Critical Paths under _main in BANK1
;;
;;   None.
;;
;; Critical Paths under _main in BANK2
;;
;;   None.
;;
;; Critical Paths under _main in BANK3
;;
;;   None.
;;
;; Critical Paths under _main in BANK4
;;
;;   None.
;;
;; Critical Paths under _main in BANK5
;;
;;   None.
;;
;; Critical Paths under _main in BANK6
;;
;;   None.

;;
;;Main: autosize = 0, tempsize = 0, incstack = 0, save=0
;;

;;
;;Call Graph Tables:
;;
;; ---------------------------------------------------------------------------------
;; (Depth) Function   	        Calls       Base Space   Used Autos Params    Refs
;; ---------------------------------------------------------------------------------
;; (0) _main                                                 0     0      0       0
;;                            _IO_init
;;                           _PWM_init
;;                               _hand
;; ---------------------------------------------------------------------------------
;; (1) _hand                                                 0     0      0       0
;; ---------------------------------------------------------------------------------
;; (1) _PWM_init                                             0     0      0       0
;; ---------------------------------------------------------------------------------
;; (1) _IO_init                                              0     0      0       0
;; ---------------------------------------------------------------------------------
;; Estimated maximum stack depth 1
;; ---------------------------------------------------------------------------------

;; Call Graph Graphs:

;; _main (ROOT)
;;   _IO_init
;;   _PWM_init
;;   _hand
;;

;; Address spaces:

;;Name               Size   Autos  Total    Cost      Usage
;;BIGRAM             1F0      0       0       0        0.0%
;;EEDATA             100      0       0       0        0.0%
;;NULL                 0      0       0       0        0.0%
;;CODE                 0      0       0       0        0.0%
;;BITCOMMON            E      0       0       1        0.0%
;;BITSFR0              0      0       0       1        0.0%
;;SFR0                 0      0       0       1        0.0%
;;COMMON               E      0       1       2        7.1%
;;BITSFR1              0      0       0       2        0.0%
;;SFR1                 0      0       0       2        0.0%
;;BITSFR2              0      0       0       3        0.0%
;;SFR2                 0      0       0       3        0.0%
;;STACK                0      0       1       3        0.0%
;;BITSFR3              0      0       0       4        0.0%
;;SFR3                 0      0       0       4        0.0%
;;ABS                  0      0       1       4        0.0%
;;BITBANK0            50      0       0       5        0.0%
;;BITSFR4              0      0       0       5        0.0%
;;SFR4                 0      0       0       5        0.0%
;;BANK0               50      0       0       6        0.0%
;;BITSFR5              0      0       0       6        0.0%
;;SFR5                 0      0       0       6        0.0%
;;BITBANK1            50      0       0       7        0.0%
;;BITSFR6              0      0       0       7        0.0%
;;SFR6                 0      0       0       7        0.0%
;;BANK1               50      0       0       8        0.0%
;;BITSFR7              0      0       0       8        0.0%
;;SFR7                 0      0       0       8        0.0%
;;BITBANK2            50      0       0       9        0.0%
;;BITSFR8              0      0       0       9        0.0%
;;SFR8                 0      0       0       9        0.0%
;;BANK2               50      0       0      10        0.0%
;;BITSFR9              0      0       0      10        0.0%
;;SFR9                 0      0       0      10        0.0%
;;BITBANK3            50      0       0      11        0.0%
;;BITSFR10             0      0       0      11        0.0%
;;SFR10                0      0       0      11        0.0%
;;BANK3               50      0       0      12        0.0%
;;BITSFR11             0      0       0      12        0.0%
;;SFR11                0      0       0      12        0.0%
;;BITBANK4            50      0       0      13        0.0%
;;BITSFR12             0      0       0      13        0.0%
;;SFR12                0      0       0      13        0.0%
;;BANK4               50      0       0      14        0.0%
;;BITSFR13             0      0       0      14        0.0%
;;SFR13                0      0       0      14        0.0%
;;BITBANK5            50      0       0      15        0.0%
;;BITSFR14             0      0       0      15        0.0%
;;SFR14                0      0       0      15        0.0%
;;BANK5               50      0       0      16        0.0%
;;BITSFR15             0      0       0      16        0.0%
;;SFR15                0      0       0      16        0.0%
;;BITBANK6            10      0       0      17        0.0%
;;BITSFR16             0      0       0      17        0.0%
;;SFR16                0      0       0      17        0.0%
;;BANK6               10      0       0      18        0.0%
;;BITSFR17             0      0       0      18        0.0%
;;SFR17                0      0       0      18        0.0%
;;BITSFR18             0      0       0      19        0.0%
;;SFR18                0      0       0      19        0.0%
;;DATA                 0      0       2      19        0.0%
;;BITSFR19             0      0       0      20        0.0%
;;SFR19                0      0       0      20        0.0%
;;BITSFR20             0      0       0      21        0.0%
;;SFR20                0      0       0      21        0.0%
;;BITSFR21             0      0       0      22        0.0%
;;SFR21                0      0       0      22        0.0%
;;BITSFR22             0      0       0      23        0.0%
;;SFR22                0      0       0      23        0.0%
;;BITSFR23             0      0       0      24        0.0%
;;SFR23                0      0       0      24        0.0%
;;BITSFR24             0      0       0      25        0.0%
;;SFR24                0      0       0      25        0.0%
;;BITSFR25             0      0       0      26        0.0%
;;SFR25                0      0       0      26        0.0%
;;BITSFR26             0      0       0      27        0.0%
;;SFR26                0      0       0      27        0.0%
;;BITSFR27             0      0       0      28        0.0%
;;SFR27                0      0       0      28        0.0%
;;BITSFR28             0      0       0      29        0.0%
;;SFR28                0      0       0      29        0.0%
;;BITSFR29             0      0       0      30        0.0%
;;SFR29                0      0       0      30        0.0%
;;BITSFR30             0      0       0      31        0.0%
;;SFR30                0      0       0      31        0.0%
;;BITSFR31             0      0       0      32        0.0%
;;SFR31                0      0       0      32        0.0%

	global	_main
psect	maintext,global,class=CODE,delta=2
global __pmaintext
__pmaintext:

;; *************** function _main *****************
;; Defined at:
;;		line 172 in file "H:\PIC\Machine hand.c"
;; Parameters:    Size  Location     Type
;;		None
;; Auto vars:     Size  Location     Type
;;		None
;; Return value:  Size  Location     Type
;;		None               void
;; Registers used:
;;		wreg, status,2, status,0, pclath, cstack
;; Tracked objects:
;;		On entry : 17F/0
;;		On exit  : 0/0
;;		Unchanged: 0/0
;; Data sizes:     COMMON   BANK0   BANK1   BANK2   BANK3   BANK4   BANK5   BANK6
;;      Params:         0       0       0       0       0       0       0       0
;;      Locals:         0       0       0       0       0       0       0       0
;;      Temps:          0       0       0       0       0       0       0       0
;;      Totals:         0       0       0       0       0       0       0       0
;;Total ram usage:        0 bytes
;; Hardware stack levels required when called:    1
;; This function calls:
;;		_IO_init
;;		_PWM_init
;;		_hand
;; This function is called by:
;;		Startup code after reset
;; This function uses a non-reentrant model
;;
psect	maintext
	file	"H:\PIC\Machine hand.c"
	line	172
	global	__size_of_main
	__size_of_main	equ	__end_of_main-_main
	
_main:	
	opt	stack 15
; Regs used in _main: [wreg+status,2+status,0+pclath+cstack]
	line	173
	
l6692:	
;Machine hand.c: 173: IO_init();
	fcall	_IO_init
	line	174
;Machine hand.c: 174: PWM_init();
	fcall	_PWM_init
	goto	l6694
	line	175
;Machine hand.c: 175: while(1)hand();
	
l2828:	
	
l6694:	
	fcall	_hand
	goto	l6694
	
l2829:	
	goto	l6694
	
l2830:	
	line	204
	
l2831:	
	global	start
	ljmp	start
	opt stack 0
GLOBAL	__end_of_main
	__end_of_main:
;; =============== function _main ends ============

	signat	_main,88
	global	_hand
psect	text102,local,class=CODE,delta=2
global __ptext102
__ptext102:

;; *************** function _hand *****************
;; Defined at:
;;		line 105 in file "H:\PIC\Machine hand.c"
;; Parameters:    Size  Location     Type
;;		None
;; Auto vars:     Size  Location     Type
;;		None
;; Return value:  Size  Location     Type
;;		None               void
;; Registers used:
;;		status,2
;; Tracked objects:
;;		On entry : 0/0
;;		On exit  : 0/0
;;		Unchanged: 0/0
;; Data sizes:     COMMON   BANK0   BANK1   BANK2   BANK3   BANK4   BANK5   BANK6
;;      Params:         0       0       0       0       0       0       0       0
;;      Locals:         0       0       0       0       0       0       0       0
;;      Temps:          0       0       0       0       0       0       0       0
;;      Totals:         0       0       0       0       0       0       0       0
;;Total ram usage:        0 bytes
;; Hardware stack levels used:    1
;; This function calls:
;;		Nothing
;; This function is called by:
;;		_main
;; This function uses a non-reentrant model
;;
psect	text102
	file	"H:\PIC\Machine hand.c"
	line	105
	global	__size_of_hand
	__size_of_hand	equ	__end_of_hand-_hand
	
_hand:	
	opt	stack 15
; Regs used in _hand: [status,2]
	line	106
	
l5784:	
;Machine hand.c: 106: while(RA0==0)
	goto	l2778
	
l2779:	
	line	107
;Machine hand.c: 107: RE1=1;
	bsf	(129/8),(129)&7
	
l2778:	
	line	106
	movlb 0	; select bank0
	btfss	(96/8),(96)&7
	goto	u121
	goto	u120
u121:
	goto	l2779
u120:
	goto	l2781
	
l2780:	
	line	108
;Machine hand.c: 108: while(RA1==0)
	goto	l2781
	
l2782:	
	line	109
;Machine hand.c: 109: RE2=1;
	bsf	(130/8),(130)&7
	
l2781:	
	line	108
	btfss	(97/8),(97)&7
	goto	u131
	goto	u130
u131:
	goto	l2782
u130:
	goto	l2784
	
l2783:	
	line	110
;Machine hand.c: 110: while(RA2==0)
	goto	l2784
	
l2785:	
	line	111
;Machine hand.c: 111: RE3=1;
	bsf	(131/8),(131)&7
	
l2784:	
	line	110
	btfss	(98/8),(98)&7
	goto	u141
	goto	u140
u141:
	goto	l2785
u140:
	goto	l2787
	
l2786:	
	line	112
;Machine hand.c: 112: while(RA3==0)
	goto	l2787
	
l2788:	
	line	113
;Machine hand.c: 113: RE4=1;
	bsf	(132/8),(132)&7
	
l2787:	
	line	112
	btfss	(99/8),(99)&7
	goto	u151
	goto	u150
u151:
	goto	l2788
u150:
	goto	l2790
	
l2789:	
	line	114
;Machine hand.c: 114: while(RA4==0)
	goto	l2790
	
l2791:	
	line	115
;Machine hand.c: 115: RE5=1;
	bsf	(133/8),(133)&7
	
l2790:	
	line	114
	btfss	(100/8),(100)&7
	goto	u161
	goto	u160
u161:
	goto	l2791
u160:
	goto	l2793
	
l2792:	
	line	116
;Machine hand.c: 116: while(RA5==0)
	goto	l2793
	
l2794:	
	line	117
;Machine hand.c: 117: RE6=1;
	bsf	(134/8),(134)&7
	
l2793:	
	line	116
	btfss	(101/8),(101)&7
	goto	u171
	goto	u170
u171:
	goto	l2794
u170:
	goto	l2796
	
l2795:	
	line	118
;Machine hand.c: 118: while(RD6==0)
	goto	l2796
	
l2797:	
	line	119
;Machine hand.c: 119: RF0=1;
	movlb 5	; select bank5
	bsf	(5216/8)^0280h,(5216)&7
	
l2796:	
	line	118
	movlb 0	; select bank0
	btfss	(126/8),(126)&7
	goto	u181
	goto	u180
u181:
	goto	l2797
u180:
	goto	l2799
	
l2798:	
	line	120
;Machine hand.c: 120: while(RD7==0)
	goto	l2799
	
l2800:	
	line	121
;Machine hand.c: 121: RF1=1;
	movlb 5	; select bank5
	bsf	(5217/8)^0280h,(5217)&7
	
l2799:	
	line	120
	movlb 0	; select bank0
	btfss	(127/8),(127)&7
	goto	u191
	goto	u190
u191:
	goto	l2800
u190:
	goto	l2802
	
l2801:	
	line	122
;Machine hand.c: 122: while(RB3==0)
	goto	l2802
	
l2803:	
	line	123
;Machine hand.c: 123: RF2=1;
	movlb 5	; select bank5
	bsf	(5218/8)^0280h,(5218)&7
	
l2802:	
	line	122
	movlb 0	; select bank0
	btfss	(107/8),(107)&7
	goto	u201
	goto	u200
u201:
	goto	l2803
u200:
	goto	l2805
	
l2804:	
	line	124
;Machine hand.c: 124: while(RB4==0)
	goto	l2805
	
l2806:	
	line	125
;Machine hand.c: 125: RF3=1;
	movlb 5	; select bank5
	bsf	(5219/8)^0280h,(5219)&7
	
l2805:	
	line	124
	movlb 0	; select bank0
	btfss	(108/8),(108)&7
	goto	u211
	goto	u210
u211:
	goto	l2806
u210:
	goto	l2808
	
l2807:	
	line	126
;Machine hand.c: 126: while(RB5==0)
	goto	l2808
	
l2809:	
	line	127
;Machine hand.c: 127: RF4=1;
	movlb 5	; select bank5
	bsf	(5220/8)^0280h,(5220)&7
	
l2808:	
	line	126
	movlb 0	; select bank0
	btfss	(109/8),(109)&7
	goto	u221
	goto	u220
u221:
	goto	l2809
u220:
	goto	l2811
	
l2810:	
	line	128
;Machine hand.c: 128: while(RC0==0)
	goto	l2811
	
l2812:	
	line	129
;Machine hand.c: 129: RF5=1;
	movlb 5	; select bank5
	bsf	(5221/8)^0280h,(5221)&7
	
l2811:	
	line	128
	movlb 0	; select bank0
	btfss	(112/8),(112)&7
	goto	u231
	goto	u230
u231:
	goto	l2812
u230:
	goto	l5786
	
l2813:	
	line	130
	
l5786:	
;Machine hand.c: 130: PORTE=0x00;
	clrf	(16)	;volatile
	line	131
;Machine hand.c: 131: PORTF=0x00;
	movlb 5	; select bank5
	clrf	(652)^0280h	;volatile
	line	132
	
l2814:	
	return
	opt stack 0
GLOBAL	__end_of_hand
	__end_of_hand:
;; =============== function _hand ends ============

	signat	_hand,88
	global	_PWM_init
psect	text103,local,class=CODE,delta=2
global __ptext103
__ptext103:

;; *************** function _PWM_init *****************
;; Defined at:
;;		line 72 in file "H:\PIC\Machine hand.c"
;; Parameters:    Size  Location     Type
;;		None
;; Auto vars:     Size  Location     Type
;;		None
;; Return value:  Size  Location     Type
;;		None               void
;; Registers used:
;;		wreg, status,2
;; Tracked objects:
;;		On entry : 0/0
;;		On exit  : 0/0
;;		Unchanged: 0/0
;; Data sizes:     COMMON   BANK0   BANK1   BANK2   BANK3   BANK4   BANK5   BANK6
;;      Params:         0       0       0       0       0       0       0       0
;;      Locals:         0       0       0       0       0       0       0       0
;;      Temps:          0       0       0       0       0       0       0       0
;;      Totals:         0       0       0       0       0       0       0       0
;;Total ram usage:        0 bytes
;; Hardware stack levels used:    1
;; This function calls:
;;		Nothing
;; This function is called by:
;;		_main
;; This function uses a non-reentrant model
;;
psect	text103
	file	"H:\PIC\Machine hand.c"
	line	72
	global	__size_of_PWM_init
	__size_of_PWM_init	equ	__end_of_PWM_init-_PWM_init
	
_PWM_init:	
	opt	stack 15
; Regs used in _PWM_init: [wreg+status,2]
	line	73
	
l5758:	
;Machine hand.c: 73: PR2=200;
	movlw	(0C8h)
	movlb 0	; select bank0
	movwf	(27)	;volatile
	line	74
;Machine hand.c: 74: CCP1CON=0x0f;
	movlw	(0Fh)
	movlb 5	; select bank5
	movwf	(659)^0280h	;volatile
	line	75
;Machine hand.c: 75: CCPR1L=100;
	movlw	(064h)
	movwf	(657)^0280h	;volatile
	line	76
	
l5760:	
;Machine hand.c: 76: CCPTMRS0=0x00;
	clrf	(670)^0280h	;volatile
	line	77
	
l5762:	
;Machine hand.c: 77: T2CON=0X07;
	movlw	(07h)
	movlb 0	; select bank0
	movwf	(28)	;volatile
	line	78
	
l5764:	
;Machine hand.c: 78: TRISC2=0;
	movlb 1	; select bank1
	bcf	(1138/8)^080h,(1138)&7
	line	80
	
l5766:	
;Machine hand.c: 80: PR4=200;
	movlw	(0C8h)
	movlb 8	; select bank8
	movwf	(1046)^0400h	;volatile
	line	81
	
l5768:	
;Machine hand.c: 81: CCP2CON=0x0f;
	movlw	(0Fh)
	movlb 5	; select bank5
	movwf	(666)^0280h	;volatile
	line	82
	
l5770:	
;Machine hand.c: 82: CCPR2L=100;
	movlw	(064h)
	movwf	(664)^0280h	;volatile
	line	83
	
l5772:	
;Machine hand.c: 83: CCPTMRS0=0x04;
	movlw	(04h)
	movwf	(670)^0280h	;volatile
	line	84
	
l5774:	
;Machine hand.c: 84: T4CON=0X07;
	movlw	(07h)
	movlb 8	; select bank8
	movwf	(1047)^0400h	;volatile
	line	85
	
l5776:	
;Machine hand.c: 85: APFCON=0x04;
	movlw	(04h)
	movlb 2	; select bank2
	movwf	(285)^0100h	;volatile
	line	86
	
l5778:	
;Machine hand.c: 86: TRISE7=0;
	movlb 1	; select bank1
	bcf	(1159/8)^080h,(1159)&7
	line	87
	
l2757:	
	return
	opt stack 0
GLOBAL	__end_of_PWM_init
	__end_of_PWM_init:
;; =============== function _PWM_init ends ============

	signat	_PWM_init,88
	global	_IO_init
psect	text104,local,class=CODE,delta=2
global __ptext104
__ptext104:

;; *************** function _IO_init *****************
;; Defined at:
;;		line 54 in file "H:\PIC\Machine hand.c"
;; Parameters:    Size  Location     Type
;;		None
;; Auto vars:     Size  Location     Type
;;		None
;; Return value:  Size  Location     Type
;;		None               void
;; Registers used:
;;		wreg, status,2
;; Tracked objects:
;;		On entry : 0/0
;;		On exit  : 0/0
;;		Unchanged: 0/0
;; Data sizes:     COMMON   BANK0   BANK1   BANK2   BANK3   BANK4   BANK5   BANK6
;;      Params:         0       0       0       0       0       0       0       0
;;      Locals:         0       0       0       0       0       0       0       0
;;      Temps:          0       0       0       0       0       0       0       0
;;      Totals:         0       0       0       0       0       0       0       0
;;Total ram usage:        0 bytes
;; Hardware stack levels used:    1
;; This function calls:
;;		Nothing
;; This function is called by:
;;		_main
;; This function uses a non-reentrant model
;;
psect	text104
	file	"H:\PIC\Machine hand.c"
	line	54
	global	__size_of_IO_init
	__size_of_IO_init	equ	__end_of_IO_init-_IO_init
	
_IO_init:	
	opt	stack 15
; Regs used in _IO_init: [wreg+status,2]
	line	55
	
l5744:	
;Machine hand.c: 55: TRISA=0xff;
	movlw	(0FFh)
	movlb 1	; select bank1
	movwf	(140)^080h	;volatile
	line	56
	
l5746:	
;Machine hand.c: 56: ANSELA=0x00;
	movlb 3	; select bank3
	clrf	(396)^0180h	;volatile
	line	57
	
l5748:	
;Machine hand.c: 57: TRISB=0xff;
	movlw	(0FFh)
	movlb 1	; select bank1
	movwf	(141)^080h	;volatile
	line	58
	
l5750:	
;Machine hand.c: 58: TRISC=0xff;
	movlw	(0FFh)
	movwf	(142)^080h	;volatile
	line	59
	
l5752:	
;Machine hand.c: 59: APFCON=0xff;
	movlw	(0FFh)
	movlb 2	; select bank2
	movwf	(285)^0100h	;volatile
	line	60
	
l5754:	
;Machine hand.c: 60: TRISD=0xff;
	movlw	(0FFh)
	movlb 1	; select bank1
	movwf	(143)^080h	;volatile
	line	61
	
l5756:	
;Machine hand.c: 61: TRISE=0X01;
	movlw	(01h)
	movwf	(144)^080h	;volatile
	line	62
;Machine hand.c: 62: ANSELE=0x00;
	movlb 3	; select bank3
	clrf	(400)^0180h	;volatile
	line	63
;Machine hand.c: 63: TRISF=0x00;
	movlb 6	; select bank6
	clrf	(780)^0300h	;volatile
	line	64
;Machine hand.c: 64: ANSELF=0x00;
	movlb 8	; select bank8
	clrf	(1036)^0400h	;volatile
	line	65
;Machine hand.c: 65: PORTE=0x00;
	movlb 0	; select bank0
	clrf	(16)	;volatile
	line	66
;Machine hand.c: 66: PORTF=0x00;
	movlb 5	; select bank5
	clrf	(652)^0280h	;volatile
	line	67
	
l2754:	
	return
	opt stack 0
GLOBAL	__end_of_IO_init
	__end_of_IO_init:
;; =============== function _IO_init ends ============

	signat	_IO_init,88
psect	text105,local,class=CODE,delta=2
global __ptext105
__ptext105:
	global	btemp
	btemp set 07Eh

	DABS	1,126,2	;btemp
	global	wtemp0
	wtemp0 set btemp
	end
