import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无内容',
  description = '这里还是一片空白，稍后再来看看吧~'
}) => {
  return (
    <View className={styles.emptyWrapper}>
      <View className={styles.emptyIcon}>
        <Text className={styles.iconText}>◇</Text>
      </View>
      <Text className={styles.emptyTitle}>{title}</Text>
      <Text className={styles.emptyDesc}>{description}</Text>
    </View>
  );
};

export default EmptyState;
