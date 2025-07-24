import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Divider, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RouteIcon from '@mui/icons-material/Route';

const OrderCard = ({ order, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'closed':
        return { bg: '#d1fae5', color: '#059669', border: '#a7f3d0' };
      case 'in_progress':
        return { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe' };
      default:
        return { bg: '#fef3c7', color: '#d97706', border: '#fed7aa' };
    }
  };

  const getTransportTypeColor = (type) => {
    switch (type) {
      case 'multiple':
        return { bg: '#f3e8ff', color: '#7c3aed', border: '#ddd6fe' };
      default:
        return { bg: '#d1fae5', color: '#059669', border: '#a7f3d0' };
    }
  };

  const statusStyle = getStatusColor(order.status);
  const transportStyle = getTransportTypeColor(order.transport_type);

  // Parse trip stages for display
  const getTripStagesInfo = () => {
    if (order.transport_type === 'single') {
      return {
        type: 'Single Trip',
        route: order.source_factory && order.dest_factories ? 
          `${order.source_factory} → ${order.dest_factories.split(',')[0]}` : 
          'Route not specified'
      };
    } else if (order.transport_type === 'multiple' && order.trip_stages) {
      try {
        const stages = JSON.parse(order.trip_stages);
        if (stages.length === 0) return { type: 'Multiple Trip', route: 'No stages defined' };
        
        const routeText = stages.map(stage => 
          `${stage.source} → ${stage.destination}`
        ).join(', ');
        
        return {
          type: 'Multiple Trip',
          route: routeText,
          stageCount: stages.length
        };
      } catch (e) {
        return { type: 'Multiple Trip', route: 'Invalid stage data' };
      }
    }
    return { type: 'Unknown', route: 'Route not specified' };
  };

  const tripInfo = getTripStagesInfo();

  return (
    <Card 
      sx={{ 
        height: 200,
        width: 280,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          transform: 'translateY(-2px)',
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Header with Order Number and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: '#1e293b',
              fontSize: '1rem',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            #{order.order_number}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Chip 
              label={order.status || 'open'} 
              size="small"
              sx={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.color,
                border: `1px solid ${statusStyle.border}`,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
            <Chip 
              label={tripInfo.type} 
              size="small"
              sx={{
                backgroundColor: transportStyle.bg,
                color: transportStyle.color,
                border: `1px solid ${transportStyle.border}`,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2, opacity: 0.3 }} />

        {/* Material Information */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              mb: 0.5,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600
            }}
          >
            Material Type
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {order.material_type}
          </Typography>
        </Box>

        {/* Weight Information */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              mb: 0.5,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600
            }}
          >
            Weight
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {order.material_weight} {order.weight_unit}
          </Typography>
        </Box>

        {/* Source and Destination */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              mb: 0.5,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600
            }}
          >
            Route
          </Typography>
          {order.transport_type === 'single' ? (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.25
                }}
              >
                From: {order.source_factory || 'N/A'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                To: {order.dest_factories ? (Array.isArray(order.dest_factories) ? order.dest_factories[0] : order.dest_factories) : 'N/A'}
              </Typography>
            </>
          ) : (
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {tripInfo.stageCount || 0} stage{tripInfo.stageCount > 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Vehicle Information */}
        {order.trucks && (
          <Box sx={{ mb: 1.5 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                mb: 0.5,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}
            >
              Trucks
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {order.trucks}
            </Typography>
          </Box>
        )}

        {/* Date Information */}
        {order.created_at && (
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                mb: 0.5,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}
            >
              Created
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {new Date(order.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<VisibilityIcon />}
          fullWidth
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            fontSize: '0.875rem',
            backgroundColor: '#2563eb',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard; 