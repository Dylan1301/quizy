import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Link as RouterLink} from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const TeacherLobby: React.FC = () => {
    const [pin, setPin] = useState<string>('');

    const generateRandomPin = (): string => {
        // Generate a random 4-digit PIN
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    React.useEffect(() => {
        const newPin = generateRandomPin();
        setPin(newPin);
    }, []);

    return (
        <div>
            <h1>Teacher Lobby</h1>
            <QRCode value={pin} />
            <p>PIN: {pin}</p>
            <Button as={RouterLink} to="question/:questionId">Start Room</Button>
        </div>
    );
};

export default TeacherLobby;