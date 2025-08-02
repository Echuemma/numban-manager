import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Layout } from './shared/components/layout/Layout';
import { NubanGenerator } from './features/nuban/components/NubanGenerator';
import { ValidationHistory } from './features/validation/components/ValidationHistory';
import { DataManagement } from './features/ui/components/DataManagement';
import { Settings, Database, History, Home } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'data' | 'settings'>('generator');

  const tabs = [
    { id: 'generator' as const, label: 'Generator', icon: Home },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'data' as const, label: 'Data Management', icon: Database },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'generator':
        return <NubanGenerator />;
      case 'history':
        return <ValidationHistory />;
      case 'data':
        return <DataManagement />;
      case 'settings':
        return <div className="p-6 text-center text-gray-500">Settings panel coming soon...</div>;
      default:
        return <NubanGenerator />;
    }
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-200">
            {renderActiveTab()}
          </div>
        </Layout>
      </div>
    </Provider>
  );
}

export default App;