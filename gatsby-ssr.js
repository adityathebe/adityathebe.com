import React from 'react';

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([<script key="analytics" async defer src="https://stats.adityathebe.com/latest.js" />]);
};
