import React from 'react';
import { Switch as SwitchComponent } from '@mui/material';
const Switch = ({ theme, themeApp, onChange, checked }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <SwitchComponent
        color='primary'
        value='dynamic-class-name'
        disableRipple={true}
        onChange={onChange}
        checked={checked}
        sx={{
          width: 24,
          height: 15,
          padding: 0,
          overflowX: 'scroll',
          '& .MuiSwitch-switchBase': {
            padding: '1.2px',
            margin: '0 0px',
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(9.5px)', // Giảm kích thước transform của Switch checked
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: theme?.palette.mode === 'dark' ? themeApp?.primaryColor : themeApp?.primaryColor,
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '4px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: theme?.palette.mode === 'light' ? theme?.palette.grey[100] : theme?.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: theme?.palette.mode === 'light' ? 0.7 : 0.3,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 13, // Giảm kích thước width của Switch-thumb
            height: 13, // Giảm kích thước height của Switch-thumb
          },
          '& .MuiSwitch-track': {
            borderRadius: 14 / 2,
            backgroundColor: theme?.palette.mode === 'light' ? '#a0a0a0' : '#39393D',
            opacity: 1,
            transition: theme?.transitions.create(['background-color'], {
              duration: 500,
            }),
          },
        }}
      />
    </div>
  );
};

export default Switch;
