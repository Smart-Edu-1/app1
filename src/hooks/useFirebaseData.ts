
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseData = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // حفظ البيانات
  const saveData = async (collectionName: string, data: any) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ البيانات في قاعدة البيانات"
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // تحديث البيانات
  const updateData = async (collectionName: string, id: string, data: any) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: new Date()
      });
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث البيانات في قاعدة البيانات"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // حذف البيانات
  const deleteData = async (collectionName: string, id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, id));
      
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف البيانات من قاعدة البيانات"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف البيانات",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // استرجاع البيانات
  const getData = async (collectionName: string, conditions?: any) => {
    setLoading(true);
    try {
      let q = collection(db, collectionName);
      
      if (conditions) {
        if (conditions.where) {
          q = query(q, where(conditions.where.field, conditions.where.operator, conditions.where.value));
        }
        if (conditions.orderBy) {
          q = query(q, orderBy(conditions.orderBy.field, conditions.orderBy.direction || 'asc'));
        }
      }
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return data;
    } catch (error) {
      console.error('Error getting data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل البيانات من قاعدة البيانات",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // الاستماع للتغييرات في الوقت الفعلي
  const subscribeToData = (collectionName: string, callback: (data: any[]) => void, conditions?: any) => {
    let q = collection(db, collectionName);
    
    if (conditions) {
      if (conditions.where) {
        q = query(q, where(conditions.where.field, conditions.where.operator, conditions.where.value));
      }
      if (conditions.orderBy) {
        q = query(q, orderBy(conditions.orderBy.field, conditions.orderBy.direction || 'asc'));
      }
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
  };

  return {
    saveData,
    updateData,
    deleteData,
    getData,
    subscribeToData,
    loading
  };
};
