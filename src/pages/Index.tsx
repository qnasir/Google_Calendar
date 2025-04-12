
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Calendar from '@/components/Calendar/Calendar';

const Index = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-900">CalFlow Event Manager</h1>
        </header>
        <main className="flex-1 p-6">
          <Calendar />
        </main>
      </div>
    </Provider>
  );
};

export default Index;
