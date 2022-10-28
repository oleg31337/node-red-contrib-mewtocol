# node-red-contrib-mewtocol
#### Panasonic MEWTOCOL COM protocol implementation for Node-Red

Please use official MEWTOCOL manual as a reference: [MEWTOCOL.pdf](https://mediap.industry.panasonic.eu/assets/custom-upload/Factory%20&%20Automation/PLC/Manuals/mn_all_plcs_mewtocol_user_pidsx_en.pdf)

At the moment only few read nodes are implemented:
- RD - Read Registers as 16bit values
- RCS - Read single Contact binary value
- RCC - Read Contact values as 16bit integers
- RT - Read PLC status
- RR - Read System Register values as 16bit integers
- RS - Read Timer Set values as 16bit integers
- RK - Read Timer Elapsed values as 16bit integers

... more are coming ...

### Install

Run the following command in the root directory of your Node-RED install:

    npm install node-red-contrib-mewtocol

Run the following command for global install:

    npm install -g node-red-contrib-mewtocol