import React, { useState } from 'react';
import { View, Text, Input, Textarea, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { AnonymityLevel, UserRole } from '@/types';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState<UserRole | ''>('');
  const [professionName, setProfessionName] = useState('');
  const [anonymity, setAnonymity] = useState<AnonymityLevel>('semi-anonymous');
  const [realName, setRealName] = useState('');
  const [city, setCity] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [bio, setBio] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const professionOptions = [
    { key: 'pet-funerary' as UserRole, icon: '🐾', label: '宠物殡葬师', desc: '宠物善终服务' },
    { key: 'body-groomer' as UserRole, icon: '🕊', label: '遗体整理师', desc: '遗体美容与整理' },
    { key: 'other' as UserRole, icon: '💼', label: '其他相关职业', desc: '殡葬/纪念等相关' }
  ];

  const anonymityOptions = [
    {
      key: 'public' as AnonymityLevel,
      title: '完全公开',
      desc: '头像、昵称、职业、真实姓名等信息全部公开显示。适合愿意建立个人品牌的资深从业者。'
    },
    {
      key: 'semi-anonymous' as AnonymityLevel,
      title: '半匿名（推荐）',
      desc: '显示头像、昵称、职业信息，隐藏真实姓名等敏感信息。在保护隐私的同时保持社交互动。'
    },
    {
      key: 'full-anonymous' as AnonymityLevel,
      title: '完全匿名',
      desc: '除职业类别外不显示任何个人身份信息。适合极度注重隐私或职业身份敏感的用户。'
    }
  ];

  const canNextStep1 = profession !== '';
  const canNextStep2 = realName !== '' && idNumber !== '' && city !== '' && uploadedImages.length > 0;
  const canSubmit = agreed;

  const nextStep = () => {
    if (step === 1 && canNextStep1) {
      setStep(2);
    } else if (step === 2 && canNextStep2) {
      setStep(3);
    } else if (step === 3 && canSubmit) {
      console.log('[Register] Submit application:', { profession, professionName, anonymity, realName, city, idNumber, bio });
      Taro.showLoading({ title: '提交中...' });
      setTimeout(() => {
        Taro.hideLoading();
        setStep(4);
      }, 1500);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const goHome = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const handleUpload = () => {
    Taro.chooseImage({
      count: 3 - uploadedImages.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setUploadedImages([...uploadedImages, ...res.tempFilePaths]);
      }
    });
  };

  const removeImage = (index: number) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          const newImages = [...uploadedImages];
          newImages.splice(index, 1);
          setUploadedImages(newImages);
        }
      }
    });
  };

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.stepIndicator}>
        <View className={classnames(styles.stepDot, step >= 1 && (step > 1 ? styles.stepDone : styles.stepActive))}>
          <Text>{step > 1 ? '✓' : '1'}</Text>
        </View>
        <View className={classnames(styles.stepLine, step > 1 && styles.stepLineActive)} />
        <View className={classnames(styles.stepDot, step >= 2 && (step > 2 ? styles.stepDone : styles.stepActive))}>
          <Text>{step < 2 ? '2' : step > 2 ? '✓' : '2'}</Text>
        </View>
        <View className={classnames(styles.stepLine, step > 2 && styles.stepLineActive)} />
        <View className={classnames(styles.stepDot, step >= 3 && (step > 3 ? styles.stepDone : styles.stepActive))}>
          <Text>{step < 3 ? '3' : step > 3 ? '✓' : '3'}</Text>
        </View>
      </View>

      {step === 1 && (
        <>
          <View className={styles.card}>
            <Text className={styles.cardTitle}>选择你的职业身份</Text>
            <Text className={styles.cardDesc}>认证后将获得专属身份标识，并解锁更多社区功能</Text>
            <View className={styles.optionGrid}>
              {professionOptions.map(opt => (
                <View
                  key={opt.key}
                  className={classnames(styles.optionCard, profession === opt.key && styles.optionSelected)}
                  onClick={() => {
                    setProfession(opt.key);
                    setProfessionName(opt.label);
                  }}
                >
                  <Text className={styles.optionIcon}>{opt.icon}</Text>
                  <Text className={styles.optionLabel}>{opt.label}</Text>
                  <Text className={styles.optionDesc}>{opt.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>设置匿名展示范围</Text>
            <Text className={styles.cardDesc}>你的隐私安全是我们最重视的事，随时可以在设置中更改</Text>
            {anonymityOptions.map(opt => (
              <View
                key={opt.key}
                className={classnames(styles.anonymityCard, anonymity === opt.key && styles.anonymitySelected)}
                onClick={() => setAnonymity(opt.key)}
              >
                <View className={classnames(styles.anonymityRadio, anonymity === opt.key && styles.radioSelected)}>
                  {anonymity === opt.key && <View className={styles.radioInner} />}
                </View>
                <View className={styles.anonymityContent}>
                  <Text className={styles.anonymityTitle}>{opt.title}</Text>
                  <Text className={styles.anonymityDesc}>{opt.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.btnPrimary} onClick={nextStep}>
            <Text>{canNextStep1 ? '下一步：填写身份信息' : '请选择职业身份'}</Text>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <View className={styles.card}>
            <Text className={styles.cardTitle}>个人基本信息</Text>
            <Text className={styles.cardDesc}>请如实填写，信息仅用于身份审核，不会对外公开</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>真实姓名<Text className={styles.required}>*</Text></Text>
              <Input
                className={styles.formInput}
                placeholder="请输入真实姓名"
                value={realName}
                onInput={(e) => setRealName(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>身份证号<Text className={styles.required}>*</Text></Text>
              <Input
                className={styles.formInput}
                placeholder="请输入18位身份证号"
                value={idNumber}
                onInput={(e) => setIdNumber(e.detail.value)}
                maxLength={18}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>所在城市<Text className={styles.required}>*</Text></Text>
              <Input
                className={styles.formInput}
                placeholder="如：上海市"
                value={city}
                onInput={(e) => setCity(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>个人简介</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="简单介绍一下你自己，从业年限、擅长领域等（选填）"
                value={bio}
                onInput={(e) => setBio(e.detail.value)}
                maxLength={200}
              />
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>上传职业证明材料</Text>
            <Text className={styles.cardDesc}>以下材料任选其一上传，将加快审核速度</Text>
            {uploadedImages.length === 0 ? (
              <View className={styles.uploadArea} onClick={handleUpload}>
                <Text className={styles.uploadIcon}>📎</Text>
                <Text className={styles.uploadText}>点击上传证明材料</Text>
                <Text className={styles.uploadHint}>
                  支持：职业资格证书 / 工作证明 / 营业执照 / 培训结业证
                  {'\n'}格式：JPG/PNG，单张不超过10MB
                </Text>
              </View>
            ) : (
              <>
                <View className={styles.uploadedList}>
                  {uploadedImages.map((img, index) => (
                    <View key={index} className={styles.uploadedImageWrap}>
                      <Image src={img} mode="aspectFill" className={styles.uploadedImage} />
                      <View className={styles.removeBtn} onClick={() => removeImage(index)}>
                        <Text>×</Text>
                      </View>
                    </View>
                  ))}
                  {uploadedImages.length < 3 && (
                    <View className={styles.addMoreCard} onClick={handleUpload}>
                      <Text className={styles.addMoreIcon}>+</Text>
                      <Text className={styles.addMoreText}>添加图片</Text>
                    </View>
                  )}
                </View>
                <Text className={styles.uploadedCount}>已上传 {uploadedImages.length}/3 张证明材料</Text>
              </>
            )}
          </View>

          <View className={styles.btnPrimary} onClick={nextStep}>
            <Text>
              {canNextStep2
                ? '下一步：确认并提交'
                : !canNextStep2 && uploadedImages.length === 0
                ? '请填写必填项并上传证明材料'
                : '请填写必填项'}
            </Text>
          </View>
          <View className={styles.btnSecondary} onClick={prevStep}>
            <Text>返回上一步</Text>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <View className={styles.card}>
            <Text className={styles.cardTitle}>请确认提交的信息</Text>
            <Text className={styles.cardDesc}>提交后审核人员将在1-3个工作日内完成审核</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>职业身份</Text>
              <Input className={styles.formInput} value={professionName} disabled />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>姓名</Text>
              <Input className={styles.formInput} value={realName} disabled />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>所在城市</Text>
              <Input className={styles.formInput} value={city} disabled />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>匿名设置</Text>
              <Input
                className={styles.formInput}
                value={anonymityOptions.find(o => o.key === anonymity)?.title}
                disabled
              />
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>审核说明</Text>
            <View className={styles.tipsList}>
              <Text className={styles.tipsItem}>✦ 审核周期：1-3个工作日，节假日顺延</Text>
              <Text className={styles.tipsItem}>✦ 审核通过后将获得专属认证标识</Text>
              <Text className={styles.tipsItem}>✦ 未通过审核可补充材料后重新申请</Text>
              <Text className={styles.tipsItem}>✦ 如有疑问可联系社区客服</Text>
            </View>
          </View>

          <View className={styles.agreementRow}>
            <View
              className={classnames(styles.checkbox, agreed && styles.checked)}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && <Text>✓</Text>}
            </View>
            <Text className={styles.agreementText}>
              我已阅读并同意
              <Text className={styles.link}>《用户服务协议》</Text>、
              <Text className={styles.link}>《隐私政策》</Text>、
              <Text className={styles.link}>《社区规范》</Text>，承诺所填信息真实有效。
            </Text>
          </View>

          <View className={styles.btnPrimary} onClick={nextStep}>
            <Text>{canSubmit ? '提交认证申请' : '请先阅读并同意相关协议'}</Text>
          </View>
          <View className={styles.btnSecondary} onClick={prevStep}>
            <Text>返回修改</Text>
          </View>
        </>
      )}

      {step === 4 && (
        <View className={styles.card}>
          <View className={styles.successCard}>
            <View className={styles.successIcon}>✓</View>
            <Text className={styles.successTitle}>提交成功！</Text>
            <Text className={styles.successDesc}>
              你的认证申请已提交，我们将在1-3个工作日内完成审核。{'\n'}
              审核结果将通过站内消息通知你，请留意消息中心。
            </Text>
            <View className={styles.tipsList}>
              <Text className={styles.tipsTitle}>⏳ 等待期间你可以：</Text>
              <Text className={styles.tipsItem}>1. 完善你的职业档案</Text>
              <Text className={styles.tipsItem}>2. 浏览社区动态，向同行学习</Text>
              <Text className={styles.tipsItem}>3. 在问答区参与讨论，积累社区贡献</Text>
            </View>
            <View style={{ marginTop: '64rpx', width: '100%' }}>
              <View className={styles.btnPrimary} onClick={goHome}>
                <Text>返回首页</Text>
              </View>
              <View className={styles.btnSecondary} onClick={() => Taro.navigateTo({ url: '/pages/profile/index' })}>
                <Text>去完善职业档案</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default RegisterPage;
