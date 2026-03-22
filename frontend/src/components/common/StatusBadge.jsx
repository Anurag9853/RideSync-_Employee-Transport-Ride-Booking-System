import React from 'react';
import '../../styles/badge.css';

export default function StatusBadge({ status, type = 'status' }) {
  const normalizedStatus = String(status || '').toUpperCase();
  const className = `status-badge ${type} ${normalizedStatus.toLowerCase()}`;
  
  return <span className={className}>{status}</span>;
}
