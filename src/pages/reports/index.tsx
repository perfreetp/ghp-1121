import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { ReportItem } from '@/types';
import { mockReports } from '@/data/reports';
import EmptyState from '@/components/EmptyState';

type StatusFilter = 'all' | 'pending' | 'processing' | 'resolved' | 'rejected';

const ReportsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待处理' },
    { key: 'processing', label: '处理中' },
    { key: 'resolved', label: '已解决' },
    { key: 'rejected', label: '已驳回' }
  ];

  const statusMap: Record<'pending' | 'processing' | 'resolved' | 'rejected', { label: string; className: string }> = {
    pending: { label: '⏳ 待处理', className: styles.statusPending },
    processing: { label: '🔄 处理中', className: styles.statusProcessing },
    resolved: { label: '✓ 已解决', className: styles.statusResolved },
    rejected: { label: '✕ 已驳回', className: styles.statusRejected }
  };

  const filteredReports = mockReports.filter(report => {
    if (statusFilter === 'all') return true;
    return report.status === statusFilter;
  });

  const handleNewReport = () => {
    Taro.showToast({ title: '新建举报功能开发中', icon: 'none' });
  };

  const openReport = (report: ReportItem) => {
    console.log('[Reports] Open report:', report.id);
    Taro.showToast({ title: '详情页开发中', icon: 'none' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>举报中心</Text>
      </View>

      <ScrollView scrollX className={styles.tabsRow}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabChip, statusFilter === tab.key && styles.tabActive)}
            onClick={() => setStatusFilter(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </ScrollView>

      {filteredReports.length === 0 ? (
        <EmptyState title="暂无举报记录" description="遇到违规内容时，点击右下角按钮举报~" />
      ) : (
        <View className={styles.reportList}>
          {filteredReports.map(report => (
            <View
              key={report.id}
              className={styles.reportCard}
              onClick={() => openReport(report)}
            >
              <View className={styles.cardHeader}>
                <View className={styles.targetInfo}>
                  <Text className={styles.targetTitle}>{report.targetTitle}</Text>
                </View>
                <View className={classnames(styles.statusBadge, statusMap[report.status].className)}>
                  <Text>{statusMap[report.status].label}</Text>
                </View>
              </View>

              <View className={styles.reasonBadge}>
                <Text>举报原因：{report.reason}</Text>
              </View>

              <Text className={styles.reportDetail}>{report.detail}</Text>

              <View className={styles.cardFooter}>
                <Text className={styles.createdAt}>📅 {report.createdAt}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View className={styles.fabButton} onClick={handleNewReport}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  );
};

export default ReportsPage;
