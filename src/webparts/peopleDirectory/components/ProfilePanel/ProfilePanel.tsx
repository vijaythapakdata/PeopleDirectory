import * as React from 'react';
import { Panel } from '@fluentui/react';

const ProfilePanel = ({ user, isOpen, onDismiss }: any) => {
  return (
    <Panel isOpen={isOpen} onDismiss={onDismiss} headerText="User Profile">
      {user && (
        <>
          <h3>{user.displayName}</h3>
          <p>{user.jobTitle}</p>
          <p>{user.mail}</p>
        </>
      )}
    </Panel>
  );
};

export default ProfilePanel;