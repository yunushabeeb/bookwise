import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Modal = () => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Bookwise!</AlertDialogTitle>
          <AlertDialogDescription>
            If you don't want to sign up, you can use the following default
            logins to explore the system. This is just for documentation
            purposes so recruiters can check the project without needing to sign
            up. Note: Passwords are deliberately simple for ease of use, and the
            real system hashes user passwords.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4">
          <p>
            <strong>Admin Login:</strong>
          </p>
          <p>Email: admin@bookwise.com</p>
          <p>Password: Password123@</p>
        </div>
        <div className="mt-4">
          <p>
            <strong>User Login:</strong>
          </p>
          <p>Email: user@bookwise.com</p>
          <p>Password: Password123@</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
