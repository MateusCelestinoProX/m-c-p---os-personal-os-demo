#import "ObjCExceptionCatcher.h"

BOOL catchException(void (NS_NOESCAPE ^block)(void)) {
    @try {
        block();
        return YES;
    } @catch (NSException *exception) {
        NSLog(@"[SafeExec] Caught NSException in WebKit task: %@ (reason: %@)", exception.name, exception.reason);
        return NO;
    }
}
