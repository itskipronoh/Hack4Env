import React from 'react';

export default function DebugInfo() {
	if (import.meta.env.PROD) return null;

	return (
		<div className='fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg text-xs max-w-sm z-50'>
			<h4 className='font-bold mb-2'>Debug Info</h4>
			<div>Mode: {import.meta.env.MODE}</div>
			<div>Prod: {import.meta.env.PROD ? 'true' : 'false'}</div>
			<div>Dev: {import.meta.env.DEV ? 'true' : 'false'}</div>
			<div>Base URL: {import.meta.env.BASE_URL}</div>
			<div>
				Clerk Key:{' '}
				{import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing'}
			</div>
			<div>React: {React.version}</div>
		</div>
	);
}
