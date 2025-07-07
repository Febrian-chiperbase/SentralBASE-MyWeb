import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, Trash2, RefreshCw } from 'lucide-react';

const TestDataGenerator = () => {
  const generateTestData = () => {
    console.log('🧪 Generating test data for Advanced Analytics...');
    
    // Clear existing test data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('test_') || key.startsWith('payment_session_') || key.startsWith('order_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Generate test sessions with proper step distribution
    const testSessions = [];
    for (let i = 0; i < 25; i++) {
      const sessionId = `payment_session_test_${Date.now()}_${i}`;
      
      // Ensure realistic step distribution
      let step, status;
      const rand = Math.random();
      
      if (rand < 0.3) {
        // 30% - Early stage (step 1-2)
        step = Math.random() < 0.5 ? 1 : 2;
        status = Math.random() < 0.7 ? 'active' : 'idle';
      } else if (rand < 0.7) {
        // 40% - Mid stage (step 2-3)
        step = Math.random() < 0.6 ? 2 : 3;
        status = Math.random() < 0.8 ? 'active' : 'idle';
      } else {
        // 30% - Advanced stage (step 3-4)
        step = Math.random() < 0.4 ? 3 : 4;
        status = Math.random() < 0.9 ? 'completed' : 'active';
      }
      
      const sessionData = {
        id: sessionId,
        timestamp: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Random within 30 days
        customerInfo: {
          clinicName: `Test Klinik ${i + 1}`,
          contactPerson: `Dr. Test ${i + 1}`,
          email: `test${i + 1}@klinik.com`,
          phone: `0812345678${i.toString().padStart(2, '0')}`
        },
        plan: {
          name: ['Starter', 'Professional', 'Enterprise'][Math.floor(Math.random() * 3)],
          price: [1500000, 3330000, 5000000][Math.floor(Math.random() * 3)]
        },
        step: step,
        status: status,
        activity: 'test_data',
        // Add payment method for advanced steps
        paymentMethod: step >= 3 ? {
          name: 'Transfer Bank Manual',
          selected: true
        } : null
      };
      
      testSessions.push(sessionData);
      localStorage.setItem(sessionId, JSON.stringify(sessionData));
    }
    
    // Generate test orders
    const testOrders = [];
    for (let i = 0; i < 15; i++) {
      const orderId = `order_test_${Date.now()}_${i}`;
      const orderData = {
        id: orderId,
        timestamp: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000),
        customerInfo: testSessions[i]?.customerInfo || {
          clinicName: `Order Klinik ${i + 1}`,
          contactPerson: `Dr. Order ${i + 1}`,
          email: `order${i + 1}@klinik.com`
        },
        plan: testSessions[i]?.plan || {
          name: 'Professional',
          price: 3330000
        },
        amount: [1500000, 3330000, 5000000][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.3 ? 'completed' : 'pending',
        paymentMethod: 'Transfer Bank Manual'
      };
      
      testOrders.push(orderData);
      localStorage.setItem(orderId, JSON.stringify(orderData));
    }
    
    // Generate test notifications
    for (let i = 0; i < 10; i++) {
      const notificationId = `notification_test_${Date.now()}_${i}`;
      const notification = {
        id: Date.now() + i,
        type: ['new_customer', 'payment_completed', 'step_progress'][Math.floor(Math.random() * 3)],
        message: `Test notification ${i + 1}: Customer activity detected`,
        timestamp: Date.now() - (Math.random() * 24 * 60 * 60 * 1000),
        data: testSessions[i] || {}
      };
      
      localStorage.setItem(notificationId, JSON.stringify(notification));
    }
    
    console.log('✅ Test data generated:', {
      sessions: testSessions.length,
      orders: testOrders.length,
      notifications: 10
    });
    
    alert(`Test data generated successfully!\n\nSessions: ${testSessions.length}\nOrders: ${testOrders.length}\nNotifications: 10\n\nRefresh the Advanced Analytics tab to see the data.`);
  };
  
  const clearTestData = () => {
    if (confirm('Are you sure you want to clear all test data?')) {
      let cleared = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('test_') || 
            key.startsWith('payment_session_test_') || 
            key.startsWith('order_test_') ||
            key.startsWith('notification_test_')) {
          localStorage.removeItem(key);
          cleared++;
        }
      });
      
      console.log(`🧹 Cleared ${cleared} test data items`);
      alert(`Cleared ${cleared} test data items.\n\nRefresh the dashboard to see updated data.`);
    }
  };
  
  const clearAllData = () => {
    if (confirm('⚠️ WARNING: This will clear ALL data including real customer data!\n\nAre you absolutely sure?')) {
      let cleared = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('payment_session_') || 
            key.startsWith('order_') ||
            key.startsWith('notification_') ||
            key.startsWith('activity_')) {
          localStorage.removeItem(key);
          cleared++;
        }
      });
      
      console.log(`🧹 Cleared ${cleared} data items`);
      alert(`Cleared ${cleared} data items.\n\nAll customer and analytics data has been removed.`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">🧪 Test Data Generator</h3>
      <p className="text-gray-400 text-sm mb-6">
        Generate test data to see Advanced Analytics in action
      </p>
      
      <div className="space-y-3">
        <Button
          onClick={generateTestData}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <Database className="w-4 h-4 mr-2" />
          Generate Test Data
        </Button>
        
        <Button
          onClick={() => {
            console.log('🔍 Checking current localStorage data...');
            
            const sessions = [];
            const orders = [];
            const notifications = [];
            
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              
              if (key && key.startsWith('payment_session_')) {
                try {
                  const data = JSON.parse(localStorage.getItem(key));
                  sessions.push(data);
                } catch (error) {
                  console.warn('Corrupted session:', key);
                }
              }
              
              if (key && key.startsWith('order_')) {
                try {
                  const data = JSON.parse(localStorage.getItem(key));
                  orders.push(data);
                } catch (error) {
                  console.warn('Corrupted order:', key);
                }
              }
              
              if (key && key.startsWith('notification_')) {
                try {
                  const data = JSON.parse(localStorage.getItem(key));
                  notifications.push(data);
                } catch (error) {
                  console.warn('Corrupted notification:', key);
                }
              }
            }
            
            console.log('📊 Current Data Summary:', {
              sessions: sessions.length,
              orders: orders.length,
              notifications: notifications.length
            });
            
            console.log('📋 Sample Session:', sessions[0]);
            console.log('📋 Sample Order:', orders[0]);
            
            // Check step distribution
            const stepDistribution = {};
            sessions.forEach(s => {
              const step = s.step || 'undefined';
              stepDistribution[step] = (stepDistribution[step] || 0) + 1;
            });
            
            console.log('📈 Step Distribution:', stepDistribution);
            
            // Check status distribution
            const statusDistribution = {};
            orders.forEach(o => {
              const status = o.status || 'undefined';
              statusDistribution[status] = (statusDistribution[status] || 0) + 1;
            });
            
            console.log('📊 Order Status Distribution:', statusDistribution);
            
            alert(`Current Data:\n\nSessions: ${sessions.length}\nOrders: ${orders.length}\nNotifications: ${notifications.length}\n\nCheck console for detailed breakdown.`);
          }}
          variant="outline"
          className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Debug Current Data
        </Button>
        
        <Button
          onClick={clearTestData}
          variant="outline"
          className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear Test Data Only
        </Button>
        
        <Button
          onClick={clearAllData}
          variant="outline"
          className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Data (⚠️ Dangerous)
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
        <h4 className="font-medium text-white mb-2">What will be generated:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• 25 test customer sessions</li>
          <li>• 15 test orders (mix of completed/pending)</li>
          <li>• 10 test notifications</li>
          <li>• Random timestamps within 30 days</li>
          <li>• Mix of different plans and statuses</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDataGenerator;
