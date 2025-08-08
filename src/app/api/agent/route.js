import { NextResponse } from 'next/server';
import { executeQuery } from '../../../lib/database';

export async function POST(request) {
    try {
        const { agent_code } = await request.json();

        if (!agent_code) {
            return NextResponse.json(
                { error: 'Agent code is required' },
                { status: 400 }
            );
        }

        // Check if agent_code already exists
        const existingAgent = await executeQuery(
            'SELECT id FROM agent WHERE agent_code = ?',
            [agent_code]
        );

        if (existingAgent.length > 0) {
            return NextResponse.json(
                { error: 'Agent code already exists' },
                { status: 409 }
            );
        }

        // Insert new agent
        const result = await executeQuery(
            'INSERT INTO agent (agent_code, created_at, updated_at) VALUES (?, NOW(), NOW())',
            [agent_code]
        );

        return NextResponse.json({
            success: true,
            message: 'Agent data saved successfully',
            data: {
                id: Number(result.insertId),
                agent_code,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        
        // Handle specific database errors
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return NextResponse.json(
                { error: 'Database table "agent" does not exist. Please create the table first.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
